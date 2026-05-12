using System.ComponentModel.DataAnnotations;

namespace MoonTicketApi.Models.Profile
{
    public class PurchaseTicketRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, 20)]
        public int Quantity { get; set; } = 1;

        [Range(0, 1000000)]
        public decimal UnitPriceUsd { get; set; }

        [Range(0, 1000000)]
        public decimal TotalPaidUsd { get; set; }

        [MaxLength(255)]
        public string? StripeSessionId { get; set; }
    }
}
