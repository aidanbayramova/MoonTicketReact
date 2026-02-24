using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.Settings;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class SettingController : ControllerBase
    {
        private readonly ISettingService _settingService;
        public SettingController(ISettingService settingService)
        {
            _settingService = settingService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var settings = await _settingService.GetAllAsync();
            return Ok(settings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var setting = await _settingService.GetByIdAsync(id);
            if (setting == null)return NotFound(new { message = "Setting not found" });
            return Ok(setting);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] SettingCreateDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            await _settingService.CreateAsync(model);
            return Ok("Setting created successfully");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromForm] SettingEditDto model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _settingService.EditAsync(model, id);
                return Ok("Setting updated successfully");
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
