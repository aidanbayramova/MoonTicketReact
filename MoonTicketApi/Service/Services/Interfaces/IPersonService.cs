using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.Language;
using Service.DTOs.Admin.Person;

namespace Service.Services.Interfaces
{
    public interface IPersonService
    {
        Task<IEnumerable<PersonDto>> GetAllAsync();
        Task<PersonDto> CreateAsync(PersonCreateDto model);
        Task EditAsync(PersonEditDto model, int id);
        Task DeleteAsync(int id);
        Task<PersonDto> GetByIdAsync(int id);
    }
}
