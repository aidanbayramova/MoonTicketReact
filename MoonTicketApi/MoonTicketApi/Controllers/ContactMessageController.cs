using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.ContactMessage;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class ContactMessageController : ControllerBase
    {
        private readonly IContactMessageService _contactMessageService;

        public ContactMessageController(IContactMessageService contactMessageService)
        {
            _contactMessageService = contactMessageService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _contactMessageService.GetAllAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContactMessageCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _contactMessageService.CreateAsync(dto);
            return Ok(created);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Reply(int id, [FromBody] ContactMessageReplyDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                var success = await _contactMessageService.ReplyAsync(id, dto);
                if (!success) return NotFound();
                return Ok(new { message = "Reply sent successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
