using System.ComponentModel.DataAnnotations;

namespace Service.DTOs.Admin.Subscriber
{
    public class SubscriberUnsubscribeDto
    {
        [Required]
        [EmailAddress]
        [MaxLength(120)]
        public string Email { get; set; } = string.Empty;
    }
}
