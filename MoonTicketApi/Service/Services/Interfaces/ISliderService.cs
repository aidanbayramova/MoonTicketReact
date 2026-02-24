using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Service.DTOs.Admin.Slider;
using Service.DTOs.Admin.Sliders;

namespace Service.Services.Interfaces
{
    public interface ISliderService
    {
        Task CreateAsync(SliderCreateDto model);
        Task EditAsync(SliderEditDto model, int id);
        Task DeleteAsync(int id);
        Task<IEnumerable<SliderDto>> GetAllAsync();
        Task<SliderDto> GetByIdAsync(int id);   
    }
}
