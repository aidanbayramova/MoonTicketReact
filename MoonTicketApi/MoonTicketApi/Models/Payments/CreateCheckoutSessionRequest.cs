namespace MoonTicketApi.Models.Payments
{
    public class CreateCheckoutSessionRequest
    {
        public List<CheckoutItemRequest> Items { get; set; } = new();
    }

    public class CheckoutItemRequest
    {
        public int ProductId { get; set; }
        public string Title { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public int Quantity { get; set; }
    }
}
