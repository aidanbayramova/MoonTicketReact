namespace Service.DTOs.Admin.Subscriber
{
    public class SubscriberDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UnsubscribedAt { get; set; }
    }
}
