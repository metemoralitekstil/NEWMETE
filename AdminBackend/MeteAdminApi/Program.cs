using System.Text;
using System.Threading.RateLimiting;
using MeteAdminApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=metemorali.db";
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (connectionString.StartsWith("Host=") || connectionString.Contains("supabase") || connectionString.Contains("Port=") || connectionString.Contains("User Id="))
    {
        options.UseNpgsql(connectionString);
    }
    else
    {
        options.UseSqlite(connectionString);
    }
});

builder.Services.AddTransient<MeteAdminApi.Services.IEmailService, MeteAdminApi.Services.EmailService>();

// CORS — Sadece izin verilen adreslere izin ver (güvenlik)
builder.Services.AddCors(options =>
{
    options.AddPolicy("MetemoraliPolicy", policy =>
    {
        var isProduction = !builder.Environment.IsDevelopment();
        if (isProduction)
        {
            var allowedOrigins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>() 
                ?? new[] { "https://mete-morali.com", "https://www.mete-morali.com", "https://admin.mete-morali.com" };
            policy.WithOrigins(allowedOrigins)
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
        else
        {
            // Development: localhost'a da izin ver
            policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
        }
    });
});

// Rate Limiting — API spam & Brute-force koruması (IP Bazlı Partitioning)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Genel API limiti: IP başına 100 istek / dakika
    options.AddPolicy("ApiLimit", httpContext =>
    {
        var clientIp = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                       ?? httpContext.Connection.RemoteIpAddress?.ToString()
                       ?? "unknown";

        return RateLimitPartition.GetFixedWindowLimiter(clientIp, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 100,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 5
        });
    });

    // Auth endpoint limiti: IP başına 10 istek / dakika (Brute-force kilit)
    options.AddPolicy("AuthLimit", httpContext =>
    {
        var clientIp = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault()?.Split(',')[0].Trim()
                       ?? httpContext.Connection.RemoteIpAddress?.ToString()
                       ?? "unknown";

        return RateLimitPartition.GetFixedWindowLimiter(clientIp, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 0
        });
    });
});

var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Key"];
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey ?? ""))
    };
});

var app = builder.Build();

// HTTP Security Headers Middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("X-Frame-Options", "SAMEORIGIN");
    context.Response.Headers.Append("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Append("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Append("Referrer-Policy", "strict-origin-when-cross-origin");
    context.Response.Headers.Append("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    context.Response.Headers.Append("X-Permitted-Cross-Domain-Policies", "none");
    await next();
});

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseRateLimiter();
app.UseCors("MetemoraliPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers().RequireRateLimiting("ApiLimit");

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try {
        if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.Sqlite")
        {
            context.Database.EnsureCreated();
        }
        else
        {
            var databaseCreator = context.Database.GetService<IDatabaseCreator>() as IRelationalDatabaseCreator;
            if (databaseCreator != null)
            {
                if (!databaseCreator.Exists()) databaseCreator.Create();
                try
                {
                    databaseCreator.CreateTables();
                }
                catch
                {
                    // Tablolar zaten mevcutsa oluşacak hatayı yoksayıyoruz
                }
            }
        }

        if (!context.AdminUsers.Any())
        {
            using var sha256 = System.Security.Cryptography.SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes("admin123"));
            var hashString = BitConverter.ToString(hashedBytes).Replace("-", "").ToLowerInvariant();

            context.AdminUsers.Add(new AdminUser
            {
                Username = "admin",
                PasswordHash = hashString,
                Role = "SuperAdmin"
            });
        }

        if (!context.Customers.Any())
        {
            // Seed list is kept empty, as requested by the user
        }

        if (!context.Products.Any())
        {
            context.Products.AddRange(
                new Product { 
                    Name = "Kışlık Parka", 
                    Subtitle = "Alev Almaz Premium Termal Parka",
                    Description = "Zorlu kış şartlarında, patlayıcı ortamlarda ve kaynak süreçlerinde can güvenliğini en üst düzeye çıkaran, alev almaz ve antistatik özellikli premium termal parka.", 
                    Features = "[\"Su ve Rüzgar Geçirmez Dış Katman\", \"Yüksek Görünürlüklü Reflektif Bantlar\", \"Alev Geciktirici & Antistatik Koruma\", \"Termal Isı Yalıtımlı İç Astar\"]",
                    Price = 290.00m, StockQuantity = 100, ImageUrl = "img/kislikceketon.webp",
                    SubImages = "[\"img/kislikceketon.webp\", \"img/kislikceketarka.webp\", \"img/kislikceketic.webp\"]",
                    ArticleCode = "910404",
                    CertificateCode = "OZO 1117-CPT004/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\", \"EN 20471\", \"EN 342\"]",
                    Colors = "[\"Sarı/Mavi\"]"
                },
                new Product { 
                    Name = "Supervisor Takım", 
                    Subtitle = "Çoklu Risk Korumalı Yönetici Takımı",
                    Description = "Rafineriler, kimya tesisleri ve enerji santralleri gibi yüksek riskli endüstriyel tesislerdeki yöneticiler ve denetçiler için maksimum güvenlik ve konfor sunan premium iş elbisesi.", 
                    Features = "[\"Alev Almaz & Antistatik Güçlendirilmiş Kumaş\", \"Ergonomik Kesim ve Hareket Kolaylığı\", \"Yüksek Nefes Alabilir Dikiş Yapısı\", \"Profesyonel Tasarım ve Çoklu Cep Sistemi\"]",
                    Price = 280.00m, StockQuantity = 50, ImageUrl = "img/sari_cokboydan.webp",
                    SubImages = "[\"img/sari_cokboydan.webp\", \"img/saricokreflektorluon.webp\", \"img/saricokreflektorluarka.webp\", \"img/saricokreflektorluic.webp\"]",
                    ArticleCode = "910403",
                    CertificateCode = "OZO 1117-CPT002/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\", \"EN 20471\"]",
                    Colors = "[\"Sarı/Lacivert\"]"
                },
                new Product { 
                    Name = "Hi-Vis Kaynakçı", 
                    Subtitle = "Yüksek Görünürlüklü Alev Almaz Kaynakçı Takımı",
                    Description = "Karanlık ve loş çalışma ortamlarında yüksek görünürlük sağlayan reflektörlü şeritlere sahip, erimiş metal çapaklarına karşı yüksek koruma sunan premium kaynakçı iş elbisesi.", 
                    Features = "[\"Isı ve Aleve Karşı Tam Termal Koruma\", \"Yüksek Görünürlüklü EN 20471 Sertifikalı Şeritler\", \"Kaynak Kıvılcımlarına Dayanıklı Dikişler\", \"Ergonomik Tasarım ve Antistatik Özellikler\"]",
                    Price = 275.00m, StockQuantity = 20, ImageUrl = "img/macivok_boydan.webp",
                    SubImages = "[\"img/macivok_boydan.webp\", \"img/reflektorlumavicokon.webp\", \"img/reflektorlumavicokarka.webp\", \"img/reflektorlumavicokic.webp\"]",
                    ArticleCode = "910401",
                    CertificateCode = "OZO 1117-CPT001/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\", \"EN 20471\"]",
                    Colors = "[\"Mavi/Sarı\"]"
                },
                new Product { 
                    Name = "Mavi Kaynakçı", 
                    Subtitle = "Profesyonel Mavi Kaynakçı Takımı",
                    Description = "Yoğun kaynak operasyonlarında kıvılcım ve ısı transferine karşı güvenliği sağlayan reflektörlü şeritli dayanıklı mavi kaynakçı iş elbisesi.", 
                    Features = "[\"Alev Almaz Güçlendirilmiş Kumaş Yapısı\", \"Kıvılcım ve Çapak Geçirmeyen Özel Dokuma\", \"Hassas İşler İçin Rahat ve Esnek Kesim\", \"Reflektif Şeritlerle Artırılmış Güvenlik\"]",
                    Price = 250.00m, StockQuantity = 10, ImageUrl = "img/mavi_boydan.webp",
                    SubImages = "[\"img/mavi_boydan.webp\", \"img/reflektorulumavion.webp\", \"img/reflektorulumaviarka.webp\", \"img/reflektorulumaviic.webp\"]",
                    ArticleCode = "910402",
                    CertificateCode = "OZO 1117-CPT003/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\", \"EN 17353\"]",
                    Colors = "[\"Mavi\", \"Gri\", \"Yeşil\", \"Saks\"]"
                },
                new Product { 
                    Name = "Mavi Kaynakçı (Reflektörsüz)", 
                    Subtitle = "Antistatik Kaynakçı Tulumu (Reflektörsüz)",
                    Description = "Yansıma yapması istenmeyen karanlık ve hassas askeri/endüstriyel tesisler için özel olarak tasarlanmış, alev almaz ve antistatik özellikli mat mavi kaynakçı tulumu.", 
                    Features = "[\"Alev Geciktirici & Antistatik Kalın Kumaş\", \"Kaynak ve Metal Çapaklarına Dayanıklı Yapı\", \"Kimyasallara ve Mekanik Aşınmaya Yüksek Mukavemet\", \"Yansıma Yapmayan Reflektörsüz Mat Tasarım\"]",
                    Price = 240.00m, StockQuantity = 15, ImageUrl = "img/reflektorsuzmavion.webp",
                    SubImages = "[\"img/reflektorsuzmavion.webp\", \"img/reflektorsuzmaviarka.webp\", \"img/reflektorsuzmaviic.webp\"]",
                    ArticleCode = "910405",
                    CertificateCode = "OZO 1117-CPT003/26-A1/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\"]",
                    Colors = "[\"Mavi\"]"
                },
                new Product { 
                    Name = "Supervisor Takım (Reflektörsüz)", 
                    Subtitle = "Aşırı Risk Korumalı Mühendis Takımı (Reflektörsüz)",
                    Description = "Hassas test ve gözetim laboratuvarlarında yansıma yapmayan mat yapısıyla parlamayı önleyen, yüksek korumalı reflektörsüz supervisor kıyafeti.", 
                    Features = "[\"Parlama ve Yansıma Yapmayan Mat Kumaş Teknolojisi\", \"Alev Almazlık ve Statik Elektrik Dağıtıcı Yapı\", \"Çoklu Ekipman Cebi ve Fonksiyonel Tasarım\", \"Endüstriyel Yıkamalara Karşı Ultra Dayanıklılık\"]",
                    Price = 270.00m, StockQuantity = 25, ImageUrl = "img/saricokreflektorsuzon.webp",
                    SubImages = "[\"img/saricokreflektorsuzon.webp\", \"img/saricokreflektorsuzarka.webp\"]",
                    ArticleCode = "910406",
                    CertificateCode = "OZO 1117-CPT002/26-A1/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\"]",
                    Colors = "[\"Sarı/Lacivert\"]"
                },
                new Product { 
                    Name = "Hi-Vis Kaynakçı (Reflektörsüz)", 
                    Subtitle = "Ağır Sanayi Kaynakçı Takımı (Reflektörsüz)",
                    Description = "Ağır kaynak ve metal eritme atölyeleri için üstün koruma sunan, reflektörsüz ve son derece dayanıklı kumaş yapısıyla en zorlu koşullara uygun profesyonel kaynakçı iş elbisesi.", 
                    Features = "[\"Kaynak Sıçramalarına Dayanıklı Özel Dokuma\", \"Isı Geçişini Sınırlayan Alev Almaz Yapı\", \"Kıvılcım Önleyici Antistatik Koruma\", \"Reflektörsüz, Sade İş Sahası Tasarımı\"]",
                    Price = 260.00m, StockQuantity = 30, ImageUrl = "img/reflektorsuzmavicokon.webp",
                    SubImages = "[\"img/reflektorsuzmavicokon.webp\", \"img/reflektorsuzmavicokarka.webp\"]",
                    ArticleCode = "910407",
                    CertificateCode = "OZO 1117-CPT001/26-A1/26",
                    Standards = "[\"EN 11611\", \"EN 11612\", \"EN 1149-5\"]",
                    Colors = "[\"Mavi/Sarı\"]"
                }
            );
        }

        if (!context.Orders.Any())
        {
            // Seed list is kept empty, as requested by the user
        }

        context.SaveChanges();
    } catch (Exception ex) {
        Console.WriteLine($"Database creation failed. Error: {ex.Message}");
        if (ex.InnerException != null)
        {
            Console.WriteLine($"Inner Error: {ex.InnerException.Message}");
        }
    }
}

app.Run();