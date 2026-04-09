namespace Domain.Entities
{
    public class RefundRequest : BaseEntity
    {
        public int TicketPurchaseId { get; set; }
        public TicketPurchase TicketPurchase { get; set; } = null!;

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
    }
}
