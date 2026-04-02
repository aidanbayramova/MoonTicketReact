using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.NewsAuthor;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class NewsAuthorController : ControllerBase
    {
        private readonly INewsAuthorService _newsAuthorService;

        public NewsAuthorController(INewsAuthorService newsAuthorService)
        {
            _newsAuthorService = newsAuthorService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NewsAuthorDto>>> GetAll()
        {
            var authors = await _newsAuthorService.GetAllAsync();
            return Ok(authors);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<NewsAuthorDto>> GetById(int id)
        {
            var author = await _newsAuthorService.GetByIdAsync(id);

            if (author == null)
                return NotFound();

            return Ok(author);
        }

        [HttpPost]
        public async Task<ActionResult<NewsAuthorDto>> Create([FromBody] NewsAuthorCreateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var author = await _newsAuthorService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = author.Id }, author);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Edit(int id, [FromBody] NewsAuthorEditDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                await _newsAuthorService.EditAsync(dto, id);
                return NoContent();
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
                await _newsAuthorService.DeleteAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}
