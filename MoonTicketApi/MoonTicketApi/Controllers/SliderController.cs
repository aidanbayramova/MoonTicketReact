using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.Sliders;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class SliderController : ControllerBase
    {
        private readonly ISliderService _sliderService;

        public SliderController(ISliderService sliderService)
        {
            _sliderService = sliderService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sliders = await _sliderService.GetAllAsync();
            return Ok(sliders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var slider = await _sliderService.GetByIdAsync(id);
            if (slider == null) return NotFound();
            return Ok(slider);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] SliderCreateDto model)
        {
            await _sliderService.CreateAsync(model);
            return Ok("Create Successfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromForm] SliderEditDto model)
        {
            await _sliderService.EditAsync(model, id);
            return Ok("Edit Successfully");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _sliderService.DeleteAsync(id);
            return Ok("Delete Successfully");
        }
    }
}
