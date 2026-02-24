using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Service.DTOs.Admin.Settings;
using Service.DTOs.Admin.Slider;
using Service.DTOs.Admin.Sliders;

namespace Service.Services.Interfaces
{
    public interface ISettingService
    {
        Task CreateAsync(SettingCreateDto model);
        Task EditAsync(SettingEditDto model, int id);
        Task<IEnumerable<SettingDto>> GetAllAsync();
        Task<SettingDto> GetByIdAsync(int id);
    }
}
