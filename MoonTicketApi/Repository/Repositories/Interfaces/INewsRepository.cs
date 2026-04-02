using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Repository.Repositories.Interfaces
{
    public interface INewsRepository : IBaseRepository<News>
    {
        Task<List<News>> GetAllWithAuthorAsync();
        Task<News> GetByIdWithAuthorAsync(int id);
    }
}
