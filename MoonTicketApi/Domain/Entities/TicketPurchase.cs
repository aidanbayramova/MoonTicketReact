namespace Domain.Entities
{
    public class TicketPurchase : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public DateTime EventDate { get; set; }
        public int Quantity { get; set; }

        public bool ReminderOneDaySent { get; set; }
        public bool ReminderThreeHourSent { get; set; }
    }
}
