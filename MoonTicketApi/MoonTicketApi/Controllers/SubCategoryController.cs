using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.SubCategory;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class SubCategoryController : ControllerBase
    {
        private readonly ISubCategoryService _subCategoryService;

        public SubCategoryController(ISubCategoryService subCategoryService)
        {
            _subCategoryService = subCategoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubCategoryDto>>> GetAll()
        {
            var subCategories = await _subCategoryService.GetAllAsync();
            return Ok(subCategories);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubCategoryDto>> GetById(int id)
        {
            try
            {
                var subCategory = await _subCategoryService.GetByIdAsync(id);
                return Ok(subCategory);
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] SubCategoryCreateDto dto)
        {
            try
            {
                await _subCategoryService.CreateAsync(dto);
                return Ok(new { message = "SubCategory yaradıldı" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Edit(int id, [FromBody] SubCategoryEditDto dto)
        {
            if (id != dto.Id)
                return BadRequest(new { message = "Id uyğun deyil" });

            try
            {
                await _subCategoryService.EditAsync(dto);
                return Ok(new { message = "SubCategory yeniləndi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                await _subCategoryService.DeleteAsync(id);
                return Ok(new { message = "SubCategory silindi" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
