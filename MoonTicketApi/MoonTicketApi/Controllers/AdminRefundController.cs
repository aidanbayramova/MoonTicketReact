using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MoonTicketApi.Helpers;
using Repository.Data;
using Service.Services.Interfaces;
using Stripe;

namespace MoonTicketApi.Controllers
{
    [Route("api/admin/refund-requests")]
    [ApiController]
    [Authorize]
    public class AdminRefundController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly StripeSettings _stripeSettings;

        public AdminRefundController(
            AppDbContext context,
            UserManager<ApplicationUser> userManager,
            IEmailService emailService,
            IOptions<StripeSettings> stripeSettings)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
            _stripeSettings = stripeSettings.Value;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? status = null)
        {
            var access = await EnsureAdminAccessAsync();
            if (access != null) return access;

            var query = _context.RefundRequests
                .Include(x => x.User)
                .Include(x => x.TicketPurchase)
                .ThenInclude(x => x.Product)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(status))
                query = query.Where(x => x.Status == status);

            var items = await query
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new
                {
                    id = x.Id,
                    createdDate = x.CreatedDate,
                    status = x.Status,
                    reason = x.Reason,
                    requestedQuantity = x.RequestedQuantity,
                    refundedAmountUsd = x.RefundedAmountUsd,
                    adminNote = x.AdminNote,
                    processedAtUtc = x.ProcessedAtUtc,
                    user = new
                    {
                        id = x.UserId,
                        fullName = x.User.FullName,
                        email = x.User.Email
                    },
                    ticket = new
                    {
                        id = x.TicketPurchaseId,
                        eventName = x.TicketPurchase.Product.Name,
                        eventDate = x.TicketPurchase.EventDate,
                        purchasedQuantity = x.TicketPurchase.Quantity,
                        unitPriceUsd = x.TicketPurchase.UnitPriceUsd,
                        paymentProvider = x.TicketPurchase.PaymentProvider
                    }
                })
                .ToListAsync();

            return Ok(items);
        }

        [HttpPost("{id:int}/approve")]
        public async Task<IActionResult> Approve(int id, [FromBody] RefundAdminActionModel? action)
        {
            var access = await EnsureAdminAccessAsync();
            if (access != null) return access;

            var request = await _context.RefundRequests
                .Include(x => x.User)
                .Include(x => x.TicketPurchase)
                .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (request == null)
                return NotFound(new { message = "Refund request tapilmadi." });

            if (request.Status != "Pending")
                return BadRequest(new { message = "Yalniz Pending sorghular approve oluna biler." });

            var ticket = request.TicketPurchase;
            var quantity = request.RequestedQuantity <= 0 ? 1 : request.RequestedQuantity;

            if (quantity > ticket.Quantity)
                return BadRequest(new { message = "Bu qaytarma ucun ticket quantity kifayet deyil." });

            var refundableAmount = Math.Round((ticket.UnitPriceUsd > 0 ? ticket.UnitPriceUsd : 0) * quantity, 2);
            var autoRefunded = false;

            if (ticket.PaymentProvider == "Stripe" && !string.IsNullOrWhiteSpace(ticket.StripePaymentIntentId) && refundableAmount > 0)
            {
                if (string.IsNullOrWhiteSpace(_stripeSettings.SecretKey) || _stripeSettings.SecretKey.Contains("replace_me", StringComparison.OrdinalIgnoreCase))
                    return BadRequest(new { message = "Stripe konfiqurasiyasi tam deyil. SecretKey duzgun deyil." });

                try
                {
                    StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
                    var refundService = new RefundService();
                    var amountInCents = (long)Math.Round(refundableAmount * 100m);

                    await refundService.CreateAsync(new RefundCreateOptions
                    {
                        PaymentIntent = ticket.StripePaymentIntentId,
                        Amount = amountInCents,
                        Reason = RefundReasons.RequestedByCustomer,
                        Metadata = new Dictionary<string, string>
                        {
                            ["refundRequestId"] = request.Id.ToString(),
                            ["ticketPurchaseId"] = ticket.Id.ToString(),
                            ["quantity"] = quantity.ToString()
                        }
                    });

                    autoRefunded = true;
                }
                catch (StripeException ex)
                {
                    return BadRequest(new { message = $"Stripe refund xetasi: {ex.StripeError?.Message ?? ex.Message}" });
                }
            }

            ticket.Quantity -= quantity;

            // Əvvəlcə bütün dəyərləri set et
            request.Status = "Approved";
            request.RefundedAmountUsd = refundableAmount;
            request.AdminNote = action?.Note;
            request.ProcessedAtUtc = DateTime.UtcNow;

            _context.TicketPurchases.Update(ticket);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(request.User.Email))
            {
                var refundInfo = autoRefunded
                    ? $"Refunded amount: ${refundableAmount:F2}"
                    : "Refund was approved. Payment return is marked for manual processing.";

                // Note varsa emailə əlavə et
                var noteSection = !string.IsNullOrWhiteSpace(request.AdminNote)
                    ? $"<p><strong>Admin note:</strong> {System.Net.WebUtility.HtmlEncode(request.AdminNote)}</p>"
                    : "";

                await _emailService.SendAsync(
                    request.User.Email,
                    "MoonTicket - Refund approved",
                    $"<p>Your refund request has been approved.</p>" +
                    $"<p>Event: {System.Net.WebUtility.HtmlEncode(ticket.Product.Name)}</p>" +
                    $"<p>Quantity: {quantity}</p>" +
                    $"<p>{refundInfo}</p>" +
                    noteSection
                );
            }

            return Ok(new
            {
                message = autoRefunded
                    ? "Refund approved and payment was returned via Stripe."
                    : "Refund approved. Ticket removed from user profile. Payment return is pending manual processing.",
                autoRefunded,
                refundedAmountUsd = refundableAmount
            });
        }

        [HttpPost("{id:int}/reject")]
        public async Task<IActionResult> Reject(int id, [FromBody] RefundAdminActionModel? action)
        {
            var access = await EnsureAdminAccessAsync();
            if (access != null) return access;

            var request = await _context.RefundRequests
                .Include(x => x.User)
                .Include(x => x.TicketPurchase)
                .ThenInclude(x => x.Product)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (request == null)
                return NotFound(new { message = "Refund request tapilmadi." });

            if (request.Status != "Pending")
                return BadRequest(new { message = "Yalniz Pending sorghular reject oluna biler." });

            request.Status = "Rejected";
            request.AdminNote = action?.Note;
            request.ProcessedAtUtc = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(request.User.Email))
            {
                // Note varsa emailə əlavə et
                var noteSection = !string.IsNullOrWhiteSpace(request.AdminNote)
                    ? $"<p><strong>Admin note:</strong> {System.Net.WebUtility.HtmlEncode(request.AdminNote)}</p>"
                    : "<p>No additional note.</p>";

                await _emailService.SendAsync(
                    request.User.Email,
                    "MoonTicket - Refund rejected",
                    $"<p>Your refund request was rejected.</p>" +
                    $"<p>Event: {System.Net.WebUtility.HtmlEncode(request.TicketPurchase.Product.Name)}</p>" +
                    noteSection
                );
            }

            return Ok(new { message = "Refund request rejected." });
        }

        private async Task<IActionResult?> EnsureAdminAccessAsync()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value
                         ?? User.FindFirst("sub")?.Value;

            if (string.IsNullOrWhiteSpace(userId))
                return Unauthorized(new { message = "Authentication required." });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return Unauthorized(new { message = "User not found." });

            var roles = await _userManager.GetRolesAsync(user);
            var hasAdminAccess = roles.Any(role =>
                string.Equals(role, "Admin", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(role, "SuperAdmin", StringComparison.OrdinalIgnoreCase));

            if (!hasAdminAccess) return Forbid();

            return null;
        }
    }

    public class RefundAdminActionModel
    {
        public string? Note { get; set; }
    }
}