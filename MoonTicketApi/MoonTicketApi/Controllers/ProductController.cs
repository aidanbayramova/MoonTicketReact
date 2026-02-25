using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.Product;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpGet("create-data")]
        public async Task<IActionResult> GetCreateData()
        {
            var data = await _productService.GetCreateDataAsync();
            return Ok(data);
        }

        [HttpGet("edit-data/{id}")]
        public async Task<IActionResult> GetEditData(int id)
        {
            var data = await _productService.GetEditDataAsync(id);
            if (data == null) return NotFound();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var product = await _productService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromForm] ProductEditDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var product = await _productService.UpdateAsync(dto);
            if (product == null) return NotFound();

            return Ok(product);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}

