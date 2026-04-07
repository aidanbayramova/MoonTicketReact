using System;

namespace Domain.Entities
{
    public class Subscriber : BaseEntity
    {
        public string Email { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
        public DateTime? UnsubscribedAt { get; set; }
    }
}
