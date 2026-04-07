using System.ComponentModel.DataAnnotations;

namespace Service.DTOs.Admin.ContactMessage
{
    public class ContactMessageCreateDto
    {
        [Required]
        [MaxLength(60)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(60)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(120)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(40)]
        public string Phone { get; set; } = string.Empty;

        [Required]
        [MaxLength(2000)]
        public string Message { get; set; } = string.Empty;
    }
}
