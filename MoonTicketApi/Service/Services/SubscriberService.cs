using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Subscriber;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class SubscriberService : ISubscriberService
    {
        private readonly ISubscriberRepository _subscriberRepository;
        private readonly IEmailService _emailService;
        private readonly IMapper _mapper;

        public SubscriberService(ISubscriberRepository subscriberRepository, IEmailService emailService, IMapper mapper)
        {
            _subscriberRepository = subscriberRepository;
            _emailService = emailService;
            _mapper = mapper;
        }

        public async Task<List<SubscriberDto>> GetAllAsync()
        {
            var entities = await _subscriberRepository.GetAllOrderedAsync();
            return _mapper.Map<List<SubscriberDto>>(entities);
        }

        public async Task<SubscriberDto> SubscribeAsync(SubscriberCreateDto dto)
        {
            var existing = await _subscriberRepository.GetByEmailAsync(dto.Email);
            if (existing != null)
            {
                existing.IsActive = true;
                existing.UnsubscribedAt = null;
                await _subscriberRepository.UpdateAsync(existing);

                await _emailService.SendAsync(
                    existing.Email,
                    "MoonTicket - Email confirmation",
                    BuildSubscribeConfirmationBody(existing.Email));

                return _mapper.Map<SubscriberDto>(existing);
            }

            var entity = new Subscriber
            {
                Email = dto.Email.Trim(),
                IsActive = true,
            };

            await _subscriberRepository.CreateAsync(entity);

            await _emailService.SendAsync(
                entity.Email,
                "MoonTicket - Email confirmation",
                BuildSubscribeConfirmationBody(entity.Email));

            return _mapper.Map<SubscriberDto>(entity);
        }

        public async Task<bool> UnsubscribeAsync(SubscriberUnsubscribeDto dto)
        {
            var existing = await _subscriberRepository.GetByEmailAsync(dto.Email);
            if (existing == null) return false;

            existing.IsActive = false;
            existing.UnsubscribedAt = DateTime.UtcNow;
            await _subscriberRepository.UpdateAsync(existing);

            return true;
        }

        private static string BuildSubscribeConfirmationBody(string email)
        {
            return $@"
                <div style='font-family:Arial,sans-serif;line-height:1.6;color:#1f1f1f;'>
                    <h2 style='margin-bottom:8px;'>Email confirmed</h2>
                    <p><b>{System.Net.WebUtility.HtmlEncode(email)}</b> ünvanı MoonTicket yeniliklərinə uğurla abunə oldu.</p>
                    <p>Bizdən yeni xəbər və kampaniyalarla bağlı email mesajları alacaqsınız.</p>
                    <p style='margin-top:20px;'>MoonTicket Team</p>
                </div>";
        }
    }
}
