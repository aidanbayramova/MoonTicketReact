using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.NewsAuthor;

namespace Service.Services.Interfaces
{
    public interface INewsAuthorService
    {
        Task<IEnumerable<NewsAuthorDto>> GetAllAsync();
        Task<NewsAuthorDto> GetByIdAsync(int id);
        Task<NewsAuthorDto> CreateAsync(NewsAuthorCreateDto model);
        Task EditAsync(NewsAuthorEditDto model, int id);
        Task DeleteAsync(int id);
    }
}
