using System.ComponentModel.DataAnnotations;

namespace Service.DTOs.Admin.ContactMessage
{
    public class ContactMessageReplyDto
    {
        [Required]
        [MaxLength(2000)]
        public string Reply { get; set; } = string.Empty;
    }
}
