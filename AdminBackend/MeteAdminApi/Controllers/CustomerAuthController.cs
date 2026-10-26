using Microsoft.AspNetCore.Mvc;
using MeteAdminApi.Models;
using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.RateLimiting;

using MeteAdminApi.Services;

namespace MeteAdminApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableRateLimiting("AuthLimit")]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        // In-memory list to store registrations pending verification
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, PendingRegInfo> PendingRegistrations = new();
        
        // In-memory lists for Phone Logins and Reset Passwords
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, PendingPhoneInfo> PendingPhoneLogins = new();
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, PendingResetInfo> PendingResets = new();
        private static readonly System.Collections.Concurrent.ConcurrentDictionary<string, PendingLoginInfo> PendingLogins = new();

        public class PendingRegInfo
        {
            public string FullName { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string PasswordHash { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
            public string VerificationCode { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
        }

        public class PendingPhoneInfo
        {
            public string Phone { get; set; } = string.Empty;
            public string VerificationCode { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
        }

        public class PendingResetInfo
        {
            public string Email { get; set; } = string.Empty;
            public string VerificationCode { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
        }

        public class PendingLoginInfo
        {
            public string Email { get; set; } = string.Empty;
            public string VerificationCode { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
        }

        public CustomerAuthController(ApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public class RegisterDto
        {
            public string FullName { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
        }

        public class ConfirmRegisterDto
        {
            public string Email { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;
        }

        public class LoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        public class ConfirmLoginDto
        {
            public string Email { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;
        }

        public class PhoneLoginDto
        {
            public string Phone { get; set; } = string.Empty;
        }

        public class PhoneVerifyDto
        {
            public string Phone { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;
        }

        public class ForgotPasswordDto
        {
            public string Email { get; set; } = string.Empty;
        }

        public class ResetPasswordDto
        {
            public string Email { get; set; } = string.Empty;
            public string Code { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }

        public class UpdateProfileDto
        {
            public string FullName { get; set; } = string.Empty;
            public string Phone { get; set; } = string.Empty;
            public string CurrentPassword { get; set; } = string.Empty;
            public string NewPassword { get; set; } = string.Empty;
        }

        [HttpPost("send-phone-code")]
        public IActionResult SendPhoneCode([FromBody] PhoneLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Phone))
            {
                return BadRequest(new { message = "Telefon numarası gereklidir." });
            }

            var phoneClean = dto.Phone.Trim();

            var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            var pending = new PendingPhoneInfo
            {
                Phone = phoneClean,
                VerificationCode = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };

            PendingPhoneLogins[phoneClean] = pending;

            Console.WriteLine("\n==================================================");
            Console.WriteLine($"[PHONE LOGIN CODE] To: {phoneClean}");
            Console.WriteLine($"Code: {code}");
            Console.WriteLine("==================================================\n");

            return Ok(new { message = "Doğrulama kodu telefonunuza gönderildi." });
        }

        [HttpPost("verify-phone")]
        public IActionResult VerifyPhone([FromBody] PhoneVerifyDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Phone) || string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest(new { message = "Telefon numarası ve doğrulama kodu gereklidir." });
            }

            var phoneClean = dto.Phone.Trim();

            if (!PendingPhoneLogins.TryGetValue(phoneClean, out var pending) || pending.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Doğrulama süresi dolmuş veya geçersiz istek. Lütfen tekrar kod isteyin." });
            }

            if (pending.VerificationCode != dto.Code.Trim())
            {
                return BadRequest(new { message = "Hatalı doğrulama kodu. Lütfen tekrar kontrol edin." });
            }

            PendingPhoneLogins.TryRemove(phoneClean, out _);

            // Müşteriyi telefon numarasına göre bul, yoksa yeni oluştur
            var customer = _context.Customers.FirstOrDefault(c => c.Phone == phoneClean);
            if (customer == null)
            {
                customer = new Customer
                {
                    FullName = "Telefon Kullanıcısı",
                    Email = $"phone_{Guid.NewGuid().ToString().Substring(0, 8)}@mete-morali.com", // Dummy email
                    PasswordHash = string.Empty, // No password for phone users
                    Phone = phoneClean,
                    CreatedAt = DateTime.UtcNow
                };
                _context.Customers.Add(customer);
                _context.SaveChanges();
            }

            var token = GenerateJwtToken(customer);
            return Ok(new { token, fullName = customer.FullName, email = customer.Email, phone = customer.Phone });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest(new { message = "E-posta adresi gereklidir." });
            }

            var emailNormalized = dto.Email.Trim().ToLowerInvariant();
            var customer = _context.Customers.FirstOrDefault(c => c.Email == emailNormalized);
            if (customer == null)
            {
                // Güvenlik gereği "E-posta bulunamadı" demek yerine kod gönderildi diyebiliriz, 
                // ama kolaylık olsun diye hata dönelim veya loglayalım.
                return BadRequest(new { message = "Bu e-posta adresine kayıtlı bir kullanıcı bulunamadı." });
            }

            var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            var pending = new PendingResetInfo
            {
                Email = emailNormalized,
                VerificationCode = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };

            PendingResets[emailNormalized] = pending;

            Console.WriteLine("\n==================================================");
            Console.WriteLine($"[PASSWORD RESET CODE] To: {emailNormalized}");
            Console.WriteLine($"Code: {code}");
            Console.WriteLine("==================================================\n");

            await _emailService.SendEmailAsync(emailNormalized, "Mete Moralı - Şifre Sıfırlama Kodu", 
                $"<h3>Şifre Sıfırlama</h3><p>Mete Moralı hesabınızın şifresini sıfırlamak için doğrulama kodunuz: <b>{code}</b></p><p>Bu kod 15 dakika geçerlidir.</p>");

            return Ok(new { message = "Şifre sıfırlama kodu e-postanıza gönderildi." });
        }

        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Code) || string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest(new { message = "Lütfen tüm alanları doldurun." });
            }

            var emailNormalized = dto.Email.Trim().ToLowerInvariant();

            if (!PendingResets.TryGetValue(emailNormalized, out var pending) || pending.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Doğrulama süresi dolmuş veya geçersiz istek. Lütfen tekrar kod isteyin." });
            }

            if (pending.VerificationCode != dto.Code.Trim())
            {
                return BadRequest(new { message = "Hatalı doğrulama kodu. Lütfen tekrar kontrol edin." });
            }

            if (dto.NewPassword.Length < 6)
            {
                return BadRequest(new { message = "Yeni şifre en az 6 karakter olmalıdır." });
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Email == emailNormalized);
            if (customer == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            using var sha256 = SHA256.Create();
            var newHashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.NewPassword));
            customer.PasswordHash = BitConverter.ToString(newHashedBytes).Replace("-", "").ToLowerInvariant();

            _context.SaveChanges();
            PendingResets.TryRemove(emailNormalized, out _);

            return Ok(new { message = "Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz." });
        }

        [HttpPost("refresh-token")]
        [Authorize]
        public IActionResult RefreshToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var customerId))
            {
                return Unauthorized(new { message = "Oturum geçersiz veya süresi dolmuş." });
            }

            var customer = _context.Customers.Find(customerId);
            if (customer == null)
            {
                return Unauthorized(new { message = "Kullanıcı bulunamadı." });
            }

            var newToken = GenerateJwtToken(customer);
            return Ok(new { token = newToken });
        }

        [HttpPost("send-verification")]
        public async Task<IActionResult> SendVerification([FromBody] RegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.FullName))
            {
                return BadRequest(new { message = "Lütfen tüm zorunlu alanları doldurun." });
            }

            string emailNormalized;
            try
            {
                var addr = new System.Net.Mail.MailAddress(dto.Email);
                emailNormalized = addr.Address.Trim().ToLowerInvariant();
            }
            catch
            {
                return BadRequest(new { message = "Lütfen geçerli bir e-posta adresi girin (örn: isim@mail.com)." });
            }

            var emailRegex = new System.Text.RegularExpressions.Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");
            if (!emailRegex.IsMatch(emailNormalized))
            {
                return BadRequest(new { message = "Lütfen geçerli bir e-posta adresi girin (örn: isim@mail.com)." });
            }

            if (dto.Password.Length < 6)
            {
                return BadRequest(new { message = "Şifre en az 6 karakter olmalıdır." });
            }

            if (_context.Customers.Any(c => c.Email == emailNormalized))
            {
                return BadRequest(new { message = "Bu e-posta adresi zaten kayıtlı." });
            }

            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            var hashString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLowerInvariant();

            var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            var pending = new PendingRegInfo
            {
                FullName = dto.FullName.Trim(),
                Email = emailNormalized,
                PasswordHash = hashString,
                Phone = dto.Phone?.Trim() ?? string.Empty,
                VerificationCode = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15)
            };

            PendingRegistrations[emailNormalized] = pending;

            Console.WriteLine("\n==================================================");
            Console.WriteLine($"[EMAIL VERIFICATION CODE] To: {emailNormalized}");
            Console.WriteLine($"Code: {code}");
            Console.WriteLine("==================================================\n");

            await _emailService.SendEmailAsync(emailNormalized, "Mete Moralı - E-posta Doğrulama Kodu", 
                $"<h3>Kayıt Doğrulama</h3><p>Mete Moralı hesabınızı doğrulamak için kayıt doğrulama kodunuz: <b>{code}</b></p><p>Bu kod 15 dakika geçerlidir.</p>");

            return Ok(new { message = "Doğrulama kodu e-posta adresinize gönderildi." });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] ConfirmRegisterDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest(new { message = "E-posta ve doğrulama kodu gereklidir." });
            }

            var emailNormalized = dto.Email.Trim().ToLowerInvariant();

            if (!PendingRegistrations.TryGetValue(emailNormalized, out var pending) || pending.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Doğrulama süresi dolmuş veya geçersiz istek. Lütfen tekrar kod isteyin." });
            }

            if (pending.VerificationCode != dto.Code.Trim())
            {
                return BadRequest(new { message = "Hatalı doğrulama kodu. Lütfen tekrar kontrol edin." });
            }

            if (_context.Customers.Any(c => c.Email == emailNormalized))
            {
                PendingRegistrations.TryRemove(emailNormalized, out _);
                return BadRequest(new { message = "Bu e-posta adresi zaten kayıtlı." });
            }

            var customer = new Customer
            {
                FullName = pending.FullName,
                Email = emailNormalized,
                PasswordHash = pending.PasswordHash,
                Phone = pending.Phone,
                CreatedAt = DateTime.UtcNow
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            PendingRegistrations.TryRemove(emailNormalized, out _);

            var token = GenerateJwtToken(customer);
            return Ok(new { token, fullName = customer.FullName, email = customer.Email, phone = customer.Phone });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
            {
                return BadRequest(new { message = "E-posta ve şifre gereklidir." });
            }

            var emailNormalized = dto.Email.Trim().ToLowerInvariant();
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.Password));
            var hashString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLowerInvariant();

            var customer = _context.Customers.FirstOrDefault(c => c.Email == emailNormalized && c.PasswordHash == hashString);
            if (customer == null)
            {
                return Unauthorized(new { message = "Geçersiz e-posta veya şifre." });
            }

            var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();

            var pending = new PendingLoginInfo
            {
                Email = emailNormalized,
                VerificationCode = code,
                ExpiresAt = DateTime.UtcNow.AddMinutes(3) // 3 minutes expiration time
            };

            PendingLogins[emailNormalized] = pending;

            Console.WriteLine("\n==================================================");
            Console.WriteLine($"[2FA LOGIN CODE] To: {emailNormalized}");
            Console.WriteLine($"Code: {code}");
            Console.WriteLine("==================================================\n");

            await _emailService.SendEmailAsync(emailNormalized, "Mete Moralı - Giriş Doğrulama Kodu (2FA)", 
                $"<h3>Giriş Doğrulama</h3><p>Mete Moralı hesabınıza giriş yapmak için tek kullanımlık güvenlik kodunuz: <b>{code}</b></p><p>Bu kod 3 dakika geçerlidir.</p>");

            return Ok(new { status = "VerificationRequired", email = emailNormalized, message = "Lütfen e-postanıza gönderilen 3 dakikalık doğrulama kodunu girin." });
        }

        [HttpPost("verify-login")]
        public IActionResult VerifyLogin([FromBody] ConfirmLoginDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Code))
            {
                return BadRequest(new { message = "E-posta ve doğrulama kodu gereklidir." });
            }

            var emailNormalized = dto.Email.Trim().ToLowerInvariant();

            if (!PendingLogins.TryGetValue(emailNormalized, out var pending) || pending.ExpiresAt < DateTime.UtcNow)
            {
                return BadRequest(new { message = "Doğrulama süresi dolmuş (3 dakika) veya geçersiz istek. Lütfen tekrar giriş yapın." });
            }

            if (pending.VerificationCode != dto.Code.Trim())
            {
                return BadRequest(new { message = "Hatalı doğrulama kodu. Lütfen tekrar kontrol edin." });
            }

            PendingLogins.TryRemove(emailNormalized, out _);

            var customer = _context.Customers.FirstOrDefault(c => c.Email == emailNormalized);
            if (customer == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            var token = GenerateJwtToken(customer);
            return Ok(new { token, fullName = customer.FullName, email = customer.Email, phone = customer.Phone });
        }

        [HttpGet("profile")]
        [Authorize]
        public IActionResult GetProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var customerId))
            {
                return Unauthorized(new { message = "Oturum geçersiz veya süresi dolmuş." });
            }

            var customer = _context.Customers.Find(customerId);
            if (customer == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            return Ok(new { fullName = customer.FullName, email = customer.Email, phone = customer.Phone });
        }

        [HttpPut("profile")]
        [Authorize]
        public IActionResult UpdateProfile([FromBody] UpdateProfileDto dto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var customerId))
            {
                return Unauthorized(new { message = "Oturum geçersiz veya süresi dolmuş." });
            }

            var customer = _context.Customers.Find(customerId);
            if (customer == null)
            {
                return NotFound(new { message = "Kullanıcı bulunamadı." });
            }

            if (!string.IsNullOrWhiteSpace(dto.FullName))
            {
                customer.FullName = dto.FullName.Trim();
            }

            if (dto.Phone != null)
            {
                customer.Phone = dto.Phone.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                if (string.IsNullOrWhiteSpace(dto.CurrentPassword))
                {
                    return BadRequest(new { message = "Şifre güncellemek için mevcut şifrenizi girmeniz gerekmektedir." });
                }

                using var sha256 = SHA256.Create();
                var currentHashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.CurrentPassword));
                var currentHashString = BitConverter.ToString(currentHashedBytes).Replace("-", "").ToLowerInvariant();

                if (customer.PasswordHash != currentHashString)
                {
                    return BadRequest(new { message = "Mevcut şifreniz hatalı." });
                }

                if (dto.NewPassword.Length < 6)
                {
                    return BadRequest(new { message = "Yeni şifre en az 6 karakter olmalıdır." });
                }

                var newHashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dto.NewPassword));
                customer.PasswordHash = BitConverter.ToString(newHashedBytes).Replace("-", "").ToLowerInvariant();
            }

            _context.SaveChanges();
            return Ok(new { message = "Profil başarıyla güncellendi.", fullName = customer.FullName, email = customer.Email, phone = customer.Phone });
        }

        private string GenerateJwtToken(Customer customer)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "MeteMoraliSuperSecretKey1234567890!");

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
                    new Claim(ClaimTypes.Email, customer.Email),
                    new Claim(ClaimTypes.Name, customer.FullName),
                    new Claim(ClaimTypes.Role, "Customer")
                }),
                Expires = DateTime.UtcNow.AddHours(8),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
