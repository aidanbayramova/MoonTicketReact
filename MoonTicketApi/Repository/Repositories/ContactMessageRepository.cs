using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Repository.Data;
using Repository.Repositories.Interfaces;

namespace Repository.Repositories
{
    public class ContactMessageRepository : BaseRepository<ContactMessage>, IContactMessageRepository
    {
        public ContactMessageRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<ContactMessage>> GetAllOrderedAsync()
        {
            return await _context.ContactMessages
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<int> DeleteRepliedOlderThanAsync(DateTime cutoffUtc)
        {
            return await _context.ContactMessages
                .Where(x => x.IsReplied && x.RepliedAt.HasValue && x.RepliedAt.Value <= cutoffUtc)
                .ExecuteDeleteAsync();
        }
    }
}
