using Microsoft.EntityFrameworkCore;
using Repository.Data;
using Service.Services.Interfaces;

namespace MoonTicketApi.BackgroundServices
{
    public class EventReminderBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly ILogger<EventReminderBackgroundService> _logger;

        public EventReminderBackgroundService(
            IServiceScopeFactory scopeFactory,
            ILogger<EventReminderBackgroundService> logger)
        {
            _scopeFactory = scopeFactory;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    var now = DateTime.UtcNow;
                    var inOneDay = now.AddDays(1);
                    var inThreeHours = now.AddHours(3);

                    var tickets = await db.TicketPurchases
                        .Include(x => x.Product)
                        .Include(x => x.User)
                        .Where(x => x.EventDate > now)
                        .ToListAsync(stoppingToken);

                    foreach (var ticket in tickets)
                    {
                        if (!ticket.ReminderOneDaySent && ticket.EventDate <= inOneDay && ticket.EventDate > inThreeHours)
                        {
                            await emailService.SendAsync(
                                ticket.User.Email!,
                                "MoonTicket - Tədbirə 1 gün qaldı",
                                BuildReminderHtml(ticket.User.FullName, ticket.Product.Name, ticket.EventDate, "1 gün")
                            );
                            ticket.ReminderOneDaySent = true;
                        }

                        if (!ticket.ReminderThreeHourSent && ticket.EventDate <= inThreeHours)
                        {
                            await emailService.SendAsync(
                                ticket.User.Email!,
                                "MoonTicket - Tədbirə 3 saat qaldı",
                                BuildReminderHtml(ticket.User.FullName, ticket.Product.Name, ticket.EventDate, "3 saat")
                            );
                            ticket.ReminderThreeHourSent = true;
                        }
                    }

                    await db.SaveChangesAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Event reminder background service failed.");
                }

                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }

        private static string BuildReminderHtml(string fullName, string eventName, DateTime eventDate, string leftTime)
        {
            return $@"
<div style='font-family:Segoe UI,Tahoma,sans-serif;background:#0f141d;padding:28px;'>
  <div style='max-width:620px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 18px 38px rgba(0,0,0,.2);'>
    <div style='background:linear-gradient(120deg,#111827,#7f1d1d);padding:26px 28px;color:#fff;'>
      <h1 style='margin:0;font-size:26px;font-weight:700;'>MoonTicket</h1>
      <p style='margin:8px 0 0;opacity:.9;'>Tədbir xatırlatması</p>
    </div>
    <div style='padding:28px;'>
      <p style='margin:0 0 16px;color:#374151;font-size:15px;line-height:1.6;'>Salam {fullName}, <strong>{eventName}</strong> tədbirinə {leftTime} qalıb.</p>
      <p style='margin:0;color:#6b7280;font-size:14px;'>Tarix: {eventDate:dd.MM.yyyy HH:mm}</p>
    </div>
  </div>
</div>";
        }
    }
}
