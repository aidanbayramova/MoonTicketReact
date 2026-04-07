using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Repository.Data;
using Repository.Repositories.Interfaces;

namespace Repository.Repositories
{
    public class SubscriberRepository : BaseRepository<Subscriber>, ISubscriberRepository
    {
        public SubscriberRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<Subscriber>> GetAllOrderedAsync()
        {
            return await _context.Subscribers
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<Subscriber?> GetByEmailAsync(string email)
        {
            var normalized = email.Trim().ToLower();
            return await _context.Subscribers
                .FirstOrDefaultAsync(x => x.Email.ToLower() == normalized);
        }
    }
}
