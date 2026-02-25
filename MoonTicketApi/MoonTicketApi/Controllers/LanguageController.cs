using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.Language;
using Service.DTOs.Admin.Person;
using Service.Services;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class LanguageController : ControllerBase
    {
        private readonly ILanguageService _languageService;

        public LanguageController(ILanguageService languageService)
        {
            _languageService = languageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LanguageDto>>> GetAll()
        {
            var languages = await _languageService.GetAllAsync();
            return Ok(languages);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LanguageDto>> GetById(int id)
        {
            var language = await _languageService.GetByIdAsync(id);

            if (language == null)
                return NotFound();

            return Ok(language);
        }

        [HttpPost]
        public async Task<ActionResult<LanguageDto>> Create([FromBody] LanguageCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var language = await _languageService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = language.Id }, language);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] LanguageEditDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _languageService.EditAsync(dto, id);
                return NoContent(); // 204 - heç nə qaytarmır, frontend alert göstərir
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _languageService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
