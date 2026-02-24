using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.SubCategory;

namespace Service.Services.Interfaces
{
    public interface ISubCategoryService
    {
        Task<IEnumerable<SubCategoryDto>> GetAllAsync();
        Task<SubCategoryDto> GetByIdAsync(int id);
        Task CreateAsync(SubCategoryCreateDto dto);
        Task EditAsync(SubCategoryEditDto dto);
        Task DeleteAsync(int id);
    }
}
