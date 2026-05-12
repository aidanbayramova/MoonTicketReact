using System.Security.Claims;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MoonTicketApi.Models.Profile;
using MoonTicketApi.Helpers;
using Repository.Data;
using Service.Services.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _environment;
        private readonly IEmailService _emailService;
        private readonly StripeSettings _stripeSettings;

        public ProfileController(
            UserManager<ApplicationUser> userManager,
            AppDbContext context,
            IWebHostEnvironment environment,
            IEmailService emailService,
            IOptions<StripeSettings> stripeSettings)
        {
            _userManager = userManager;
            _context = context;
            _environment = environment;
            _emailService = emailService;
            _stripeSettings = stripeSettings.Value;
        }

        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return Unauthorized();
            }

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                fullName = user.FullName,
                userName = user.UserName,
                email = user.Email,
                emailConfirmed = user.EmailConfirmed,
                phone = user.PhoneNumber,
                birthDate = user.BirthDate,
                profileImage = user.ProfileImage,
                roles = roles
            });
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateMe([FromBody] UpdateProfileRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var age = CalculateAge(request.BirthDate);
            if (age < 18)
            {
                return BadRequest(new { message = "Profil üçün yaş 18 və üzəri olmalıdır." });
            }

            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return Unauthorized();
            }

            user.FullName = request.FullName;
            user.PhoneNumber = request.Phone;
            user.BirthDate = request.BirthDate;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Profil yenilənmədi.", errors = result.Errors.Select(x => x.Description) });
            }

            return Ok(new { message = "Profil yeniləndi." });
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile photo)
        {
            if (photo == null || photo.Length == 0)
            {
                return BadRequest(new { message = "Şəkil seçilməyib." });
            }

            var extension = Path.GetExtension(photo.FileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            if (!allowed.Contains(extension))
            {
                return BadRequest(new { message = "Yalnız jpg, jpeg, png, webp fayllarına icazə var." });
            }

            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return Unauthorized();
            }

            var folder = Path.Combine(_environment.WebRootPath, "ProfileImages");
            Directory.CreateDirectory(folder);

            var fileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(folder, fileName);

            await using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await photo.CopyToAsync(stream);
            }

            user.ProfileImage = $"/ProfileImages/{fileName}";
            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Şəkil yadda saxlanmadı." });
            }

            return Ok(new { profileImage = user.ProfileImage });
        }

        [HttpGet("tickets")]
        public async Task<IActionResult> MyTickets()
        {
            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return Unauthorized();
            }

            var now = DateTime.UtcNow;
            var tickets = await _context.TicketPurchases
                .Include(x => x.Product)
                .Where(x => x.UserId == user.Id)
                .OrderBy(x => x.EventDate)
                .Select(x => new
                {
                    id = x.Id,
                    productId = x.ProductId,
                    eventName = x.Product.Name,
                    image = x.Product.Image,
                    eventDate = x.EventDate,
                    quantity = x.Quantity,
                    isPast = x.EventDate < now
                })
                .ToListAsync();

            return Ok(tickets);
        }

        [HttpPost("purchase")]
        public async Task<IActionResult> Purchase([FromBody] PurchaseTicketRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return Unauthorized();
            }

            var product = await _context.Products.FirstOrDefaultAsync(x => x.Id == request.ProductId);
            if (product == null)
            {
                return NotFound(new { message = "Tədbir tapılmadı." });
            }

            var purchase = new TicketPurchase
            {
                UserId = user.Id,
                ProductId = product.Id,
                EventDate = DateTime.SpecifyKind(product.StartDate, DateTimeKind.Utc),
                Quantity = request.Quantity,
                UnitPriceUsd = request.UnitPriceUsd > 0
                    ? request.UnitPriceUsd
                    : request.TotalPaidUsd > 0
                        ? Math.Round(request.TotalPaidUsd / request.Quantity, 2)
                        : 0,
                TotalPaidUsd = request.TotalPaidUsd > 0
                    ? request.TotalPaidUsd
                    : request.UnitPriceUsd > 0
                        ? request.UnitPriceUsd * request.Quantity
                        : 0,
                PaymentProvider = string.IsNullOrWhiteSpace(request.StripeSessionId) ? "Manual" : "Stripe",
                StripeSessionId = string.IsNullOrWhiteSpace(request.StripeSessionId) ? null : request.StripeSessionId,
            };

            if (!string.IsNullOrWhiteSpace(request.StripeSessionId)
                && !string.IsNullOrWhiteSpace(_stripeSettings.SecretKey)
                && !_stripeSettings.SecretKey.Contains("replace_me", StringComparison.OrdinalIgnoreCase))
            {
                try
                {
                    StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
                    var sessionService = new SessionService();
                    var session = await sessionService.GetAsync(request.StripeSessionId);
                    purchase.StripePaymentIntentId = session.PaymentIntentId;
                }
                catch
                {
                    // Keep purchase creation resilient even if Stripe lookup fails.
                }
            }

            _context.TicketPurchases.Add(purchase);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Bilet alındı.", ticketId = purchase.Id });
        }

        [HttpPost("refund-request")]
        public async Task<IActionResult> CreateRefundRequest([FromBody] RefundRequestCreateModel request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await GetCurrentUserAsync();
            if (user == null)
            {
                return Unauthorized();
            }

            var ticket = await _context.TicketPurchases
                .FirstOrDefaultAsync(x => x.Id == request.TicketPurchaseId && x.UserId == user.Id);
            if (ticket == null)
            {
                return NotFound(new { message = "Bilet tapılmadı." });
            }

            if (ticket.EventDate <= DateTime.UtcNow)
            {
                return BadRequest(new { message = "Keçmiş tədbir bileti üçün qaytarma sorğusu göndərilə bilməz." });
            }

            if (request.Quantity > ticket.Quantity)
            {
                return BadRequest(new { message = "Qaytarılacaq say alınan bilet sayından çox ola bilməz." });
            }

            var pendingQuantity = await _context.RefundRequests
                .Where(x => x.TicketPurchaseId == ticket.Id && x.UserId == user.Id && x.Status == "Pending")
                .SumAsync(x => (int?)x.RequestedQuantity) ?? 0;

            var remainingRefundable = ticket.Quantity - pendingQuantity;
            if (remainingRefundable <= 0)
            {
                return BadRequest(new { message = "Bu bilet üçün artıq aktiv qaytarma sorğusu var." });
            }

            if (request.Quantity > remainingRefundable)
            {
                return BadRequest(new { message = $"Maksimum {remainingRefundable} bilet üçün qaytarma sorğusu göndərə bilərsiniz." });
            }

            var refundRequest = new RefundRequest
            {
                TicketPurchaseId = ticket.Id,
                UserId = user.Id,
                RequestedQuantity = request.Quantity,
                Reason = request.Reason,
                Status = "Pending"
            };

            _context.RefundRequests.Add(refundRequest);
            await _context.SaveChangesAsync();

            if (!string.IsNullOrWhiteSpace(user.Email))
            {
                await _emailService.SendAsync(
                    user.Email,
                    "MoonTicket - Refund request received",
                    $"<p>Your refund request has been received.</p><p>Ticket ID: {ticket.Id}</p><p>Requested quantity: {request.Quantity}</p><p>Reason: {System.Net.WebUtility.HtmlEncode(request.Reason)}</p>"
                );
            }

            return Ok(new { message = "Qaytarma sorğusu göndərildi." });
        }

        private async Task<ApplicationUser?> GetCurrentUserAsync()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)
                         ?? User.FindFirstValue(ClaimTypes.Name)
                         ?? User.FindFirstValue("sub");
            if (string.IsNullOrWhiteSpace(userId))
            {
                return null;
            }

            return await _userManager.Users.FirstOrDefaultAsync(x => x.Id == userId);
        }

        private static int CalculateAge(DateTime birthDate)
        {
            var today = DateTime.Today;
            var age = today.Year - birthDate.Year;
            if (birthDate.Date > today.AddYears(-age))
            {
                age--;
            }
            return age;
        }
    }
}
