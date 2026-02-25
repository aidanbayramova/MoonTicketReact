using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.Product;

namespace Service.Services.Interfaces
{
    public interface IProductService
    {
        Task<List<ProductDto>> GetAllAsync();
        Task<ProductDetailDto> GetByIdAsync(int id);
        Task<ProductDto> CreateAsync(ProductCreateDto dto);
        Task<ProductDto> UpdateAsync(ProductEditDto dto);
        Task<bool> DeleteAsync(int id);
        Task<ProductCreateDto> GetCreateDataAsync();
        Task<ProductEditDto> GetEditDataAsync(int id);
    }
}
