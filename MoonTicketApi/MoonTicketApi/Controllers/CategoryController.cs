using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.Category;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
        {
            return Ok(await _categoryService.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetById(int id)
        {
            try
            {
                return Ok(await _categoryService.GetByIdAsync(id));
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> Create([FromForm] CategoryCreateDto dto)
        {
            await _categoryService.CreateAsync(dto);
            return Ok(new { message = "Category created successfully" });
        }

        [HttpPut("{id}")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult> Edit(int id, [FromForm] CategoryEditDto dto)
        {
            dto.Id = id;

            try
            {
                await _categoryService.EditAsync(dto);
                return Ok(new { message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _categoryService.DeleteAsync(id);
                return Ok(new { message = "Category deleted successfully" });
            }
            catch (System.Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
