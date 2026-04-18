using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MoonTicketApi.Helpers;
using MoonTicketApi.Models.Payments;
using Stripe;
using Stripe.Checkout;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly StripeSettings _stripeSettings;
        private readonly IConfiguration _configuration;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(
            IOptions<StripeSettings> stripeSettings,
            IConfiguration configuration,
            UserManager<ApplicationUser> userManager,
            ILogger<PaymentsController> logger)
        {
            _stripeSettings = stripeSettings.Value;
            _configuration = configuration;
            _userManager = userManager;
            _logger = logger;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] CreateCheckoutSessionRequest request)
        {
            if (request.Items == null || request.Items.Count == 0)
            {
                return BadRequest(new { message = "Basket bosdur." });
            }

            if (string.IsNullOrWhiteSpace(_stripeSettings.SecretKey))
            {
                return BadRequest(new { message = "Stripe SecretKey config yoxdur." });
            }

            if (_stripeSettings.SecretKey.Contains("replace_me", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest(new
                {
                    message = "Stripe acarlari konfiqurasiya olunmayib. appsettings.Development.json faylinda StripeSettings SecretKey/PublishableKey deyerlerini real test acarlarla yenileyin."
                });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized();
            }

            if (!user.EmailConfirmed)
            {
                return BadRequest(new { message = "Stripe odenisi ucun email tesdiqi lazimdir." });
            }

            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;

            var frontendBaseUrl = _configuration["FrontendBaseUrl"] ?? "http://localhost:5173";

            var lineItems = request.Items
                .Where(x => x.Quantity > 0 && x.Total > 0)
                .Select(x =>
                {
                    var unitAmount = Math.Max(1, (long)Math.Round((x.Total / x.Quantity) * 100m));

                    return new SessionLineItemOptions
                    {
                        Quantity = x.Quantity,
                        PriceData = new SessionLineItemPriceDataOptions
                        {
                            Currency = "usd",
                            UnitAmount = unitAmount,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = string.IsNullOrWhiteSpace(x.Title) ? $"Ticket #{x.ProductId}" : x.Title,
                            }
                        }
                    };
                })
                .ToList();

            if (lineItems.Count == 0)
            {
                return BadRequest(new { message = "Odenis ucun duzgun basket item yoxdur." });
            }

            var options = new SessionCreateOptions
            {
                Mode = "payment",
                LineItems = lineItems,
                SuccessUrl = $"{frontendBaseUrl}/payment/success?session_id={{CHECKOUT_SESSION_ID}}",
                CancelUrl = $"{frontendBaseUrl}/payment/cancel",
                CustomerEmail = user.Email,
                Metadata = new Dictionary<string, string>
                {
                    ["userId"] = user.Id,
                    ["itemCount"] = lineItems.Count.ToString()
                }
            };

            Session session;
            try
            {
                var service = new SessionService();
                session = await service.CreateAsync(options);
            }
            catch (StripeException ex)
            {
                return BadRequest(new
                {
                    message = $"Stripe xetasi: {ex.StripeError?.Message ?? ex.Message}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Stripe checkout session creation failed unexpectedly.");
                return StatusCode(500, new
                {
                    message = $"Stripe checkout session yaradilarken xeta bas verdi: {ex.Message}"
                });
            }

            return Ok(new
            {
                url = session.Url,
                sessionId = session.Id,
                publishableKey = _stripeSettings.PublishableKey
            });
        }
    }
}
