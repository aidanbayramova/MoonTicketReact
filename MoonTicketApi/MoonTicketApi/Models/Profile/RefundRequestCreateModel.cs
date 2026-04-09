using System.ComponentModel.DataAnnotations;

namespace MoonTicketApi.Models.Profile
{
    public class RefundRequestCreateModel
    {
        [Required]
        public int TicketPurchaseId { get; set; }

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}
