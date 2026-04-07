using Service.DTOs.Admin.Subscriber;

namespace Service.Services.Interfaces
{
    public interface ISubscriberService
    {
        Task<List<SubscriberDto>> GetAllAsync();
        Task<SubscriberDto> SubscribeAsync(SubscriberCreateDto dto);
        Task<bool> UnsubscribeAsync(SubscriberUnsubscribeDto dto);
    }
}
