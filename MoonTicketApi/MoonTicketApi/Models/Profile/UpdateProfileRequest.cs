using System.ComponentModel.DataAnnotations;

namespace MoonTicketApi.Models.Profile
{
    public class UpdateProfileRequest
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public DateTime BirthDate { get; set; }
    }
}
