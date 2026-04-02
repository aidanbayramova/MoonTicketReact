using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.News;

namespace Service.Services.Interfaces
{
    public interface INewsService
    {
        Task<IEnumerable<NewsDto>> GetAllAsync();
        Task<NewsDto> GetByIdAsync(int id);
        Task<NewsDto> CreateAsync(NewsCreateDto model);
        Task EditAsync(NewsEditDto model, int id);
        Task DeleteAsync(int id);
    }
}
