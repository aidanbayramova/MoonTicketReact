using Microsoft.AspNetCore.Mvc;
using Service.DTOs.Admin.Subscriber;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller][action]")]
    [ApiController]
    public class SubscriberController : ControllerBase
    {
        private readonly ISubscriberService _subscriberService;

        public SubscriberController(ISubscriberService subscriberService)
        {
            _subscriberService = subscriberService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var list = await _subscriberService.GetAllAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> Subscribe([FromBody] SubscriberCreateDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var result = await _subscriberService.SubscribeAsync(dto);
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Unsubscribe([FromBody] SubscriberUnsubscribeDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var success = await _subscriberService.UnsubscribeAsync(dto);
            if (!success) return NotFound(new { message = "Subscriber not found" });

            return Ok(new { message = "Successfully unsubscribed" });
        }
    }
}
