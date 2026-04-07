using System.ComponentModel.DataAnnotations;

namespace Service.DTOs.Admin.Subscriber
{
    public class SubscriberCreateDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(120)]
        public string Email { get; set; } = string.Empty;
    }
}
