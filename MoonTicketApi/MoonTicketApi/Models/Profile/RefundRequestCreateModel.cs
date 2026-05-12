using System.ComponentModel.DataAnnotations;

namespace MoonTicketApi.Models.Profile
{
    public class RefundRequestCreateModel
    {
        [Required]
        public int TicketPurchaseId { get; set; }

        [Range(1, 20)]
        public int Quantity { get; set; } = 1;

        [Required]
        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;
    }
}
