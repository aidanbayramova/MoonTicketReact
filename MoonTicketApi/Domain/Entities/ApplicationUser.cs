using Microsoft.AspNetCore.Identity;

namespace Domain.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public string? ProfileImage { get; set; }

        public ICollection<TicketPurchase> TicketPurchases { get; set; } = new List<TicketPurchase>();
        public ICollection<RefundRequest> RefundRequests { get; set; } = new List<RefundRequest>();
    }
}
