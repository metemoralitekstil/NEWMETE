using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace MeteAdminApi.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"];
            var smtpPortString = emailSettings["SmtpPort"];
            var senderEmail = emailSettings["SenderEmail"];
            var senderPassword = emailSettings["SenderPassword"];

            if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(senderEmail))
            {
                // Fallback for development if settings aren't configured
                Console.WriteLine($"[EMAIL_SERVICE_MOCK] To: {toEmail}, Subject: {subject}, Body: {body}");
                return;
            }

            int.TryParse(smtpPortString, out int smtpPort);

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail, "Mete Moralı"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            mailMessage.To.Add(toEmail);

            using var smtpClient = new SmtpClient(smtpServer, smtpPort)
            {
                Credentials = new NetworkCredential(senderEmail, senderPassword),
                EnableSsl = true, // Usually required for Gmail/Outlook
            };

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EMAIL_ERROR] E-posta gönderilemedi: {ex.Message}");
                // Not throwing here so auth doesn't completely fail just because SMTP isn't working during dev.
            }
        }
    }
}
