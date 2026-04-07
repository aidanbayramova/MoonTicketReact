using Domain.Entities;

namespace Repository.Repositories.Interfaces
{
    public interface IContactMessageRepository : IBaseRepository<ContactMessage>
    {
        Task<List<ContactMessage>> GetAllOrderedAsync();
        Task<int> DeleteRepliedOlderThanAsync(DateTime cutoffUtc);
    }
}
