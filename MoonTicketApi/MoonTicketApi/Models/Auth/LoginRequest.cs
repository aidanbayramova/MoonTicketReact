using System.ComponentModel.DataAnnotations;

namespace MoonTicketApi.Models.Auth
{
    public class LoginRequest
    {
        public string? Identifier { get; set; }

        // Backward compatibility for older clients still posting "email".
        public string? Email { get; set; }

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
