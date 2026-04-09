using System.Security.Claims;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MoonTicketApi.Models.Profile;
using Repository.Data;

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

        public ProfileController(
            UserManager<ApplicationUser> userManager,
            AppDbContext context,
            IWebHostEnvironment environment)
        {
            _userManager = userManager;
            _context = context;
            _environment = environment;
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
                Quantity = request.Quantity
            };

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

            var exists = await _context.RefundRequests
                .AnyAsync(x => x.TicketPurchaseId == ticket.Id && x.UserId == user.Id && x.Status == "Pending");
            if (exists)
            {
                return BadRequest(new { message = "Bu bilet üçün artıq aktiv qaytarma sorğusu var." });
            }

            var refundRequest = new RefundRequest
            {
                TicketPurchaseId = ticket.Id,
                UserId = user.Id,
                Reason = request.Reason,
                Status = "Pending"
            };

            _context.RefundRequests.Add(refundRequest);
            await _context.SaveChangesAsync();

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
