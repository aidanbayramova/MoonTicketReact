namespace MoonTicketApi.Models.Auth
{
    public class AuthResponse
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public UserSummary User { get; set; } = new();
    }

    public class UserSummary
    {
        public string Id { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public DateTime BirthDate { get; set; }
        public string? ProfileImage { get; set; }
        public List<string> Roles { get; set; } = new();
    }
}
