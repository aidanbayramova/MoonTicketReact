using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.Language;
using Service.DTOs.Admin.Person;
using Service.DTOs.Admin.Sliders;

namespace Service.Services.Interfaces
{
    public interface ILanguageService
    {
        Task<IEnumerable<LanguageDto>> GetAllAsync();
        Task<LanguageDto> CreateAsync(LanguageCreateDto model);
        Task EditAsync(LanguageEditDto model, int id);

        Task DeleteAsync(int id);
        Task<LanguageDto> GetByIdAsync(int id);


    }
}
