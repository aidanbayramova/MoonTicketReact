namespace Service.DTOs.Admin.ContactMessage
{
    public class ContactMessageDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsReplied { get; set; }
        public string? AdminReply { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? RepliedAt { get; set; }
    }
}
