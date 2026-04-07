using Domain.Entities;

namespace Repository.Repositories.Interfaces
{
    public interface ISubscriberRepository : IBaseRepository<Subscriber>
    {
        Task<List<Subscriber>> GetAllOrderedAsync();
        Task<Subscriber?> GetByEmailAsync(string email);
    }
}
