using System.ComponentModel.DataAnnotations;

namespace MoonTicketApi.Models.Profile
{
    public class PurchaseTicketRequest
    {
        [Required]
        public int ProductId { get; set; }

        [Range(1, 20)]
        public int Quantity { get; set; } = 1;
    }
}
