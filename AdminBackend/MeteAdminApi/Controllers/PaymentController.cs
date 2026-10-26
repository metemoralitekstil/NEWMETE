using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using MeteAdminApi.Models;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace MeteAdminApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PaymentController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class PaymentRequestDto
        {
            public string CardholderName { get; set; }
            public string CardNumber { get; set; }
            public string ExpireMonth { get; set; }
            public string ExpireYear { get; set; }
            public string Cvv { get; set; }
            public decimal Amount { get; set; }
            public string CustomerName { get; set; }
            public string CustomerPhone { get; set; }
            public List<OrderItemDto> Items { get; set; }
        }

        public class OrderItemDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        [HttpPost("process")]
        [AllowAnonymous]
        public IActionResult ProcessPayment([FromBody] PaymentRequestDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.CardNumber) || request.Amount <= 0)
            {
                return BadRequest(new { message = "Geçersiz ödeme talebi." });
            }

            string cleanCard = request.CardNumber.Replace(" ", "");
            if (cleanCard.Length < 16)
            {
                return BadRequest(new { message = "Geçersiz kart numarası." });
            }

            // 1. Ürün ve Tutar Doğrulaması (Fiyat Manipülasyon Koruması - Price Tampering Prevention)
            var orderItems = new List<OrderItem>();
            decimal verifiedTotal = 0m;

            if (request.Items != null && request.Items.Any())
            {
                var productIds = request.Items.Select(i => i.ProductId).Distinct().ToList();
                var dbProducts = _context.Products.Where(p => productIds.Contains(p.Id)).ToDictionary(p => p.Id);

                foreach (var item in request.Items)
                {
                    if (item.Quantity <= 0)
                    {
                        return BadRequest(new { message = "Geçersiz ürün adedi." });
                    }

                    if (!dbProducts.TryGetValue(item.ProductId, out var product))
                    {
                        return BadRequest(new { message = $"Sistemde bulunmayan bir ürün talep edildi (ID: {item.ProductId})." });
                    }

                    // İstemcinin gönderdiği fiyata ASLA güvenilmez; veritabanındaki gerçek fiyat kullanılır
                    var actualPrice = product.Price;
                    verifiedTotal += actualPrice * item.Quantity;

                    orderItems.Add(new OrderItem
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = actualPrice
                    });
                }

                // Gönderilen tutar ile hesaplanan tutar arasında 0.05'ten büyük fark varsa isteği reddet
                if (Math.Abs(request.Amount - verifiedTotal) > 0.05m)
                {
                    return BadRequest(new { message = "Ödeme tutarı sepet tutarı ile uyuşmuyor. Fiyatlar güncellenmiş olabilir." });
                }
            }
            else
            {
                verifiedTotal = request.Amount;
            }

            // 2. Create and save the order in database with status "Ödeme Bekliyor"
            var order = new Order
            {
                CustomerName = request.CustomerName ?? "Misafir Müşteri",
                CustomerPhone = request.CustomerPhone ?? string.Empty,
                TotalAmount = verifiedTotal,
                Status = "Ödeme Bekliyor",
                OrderDate = DateTime.UtcNow,
                OrderItems = orderItems
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            string orderCode = order.Id.ToString();
            string amountStr = verifiedTotal.ToString("F2", System.Globalization.CultureInfo.InvariantCulture);

            // Bank Sanal POS merchant settings (NestPay / EST example)
            string clientId = "100300000"; // Mock Client ID
            string storeKey = "12345678"; // Mock Store Key
            string rnd = DateTime.Now.Ticks.ToString();

            // Calculate current host URL dynamically for callback action
            string scheme = Request.Scheme;
            string host = Request.Host.Value;
            string callbackUrl = $"{scheme}://{host}/api/payment/callback";

            string okUrl = "https://www.mete-morali.com/odeme-sonuc.html";
            string failUrl = "https://www.mete-morali.com/odeme-sonuc.html";
            string storeType = "3d";

            string hashString = clientId + orderCode + amountStr + okUrl + failUrl + rnd + storeKey;
            string signature = CalculateSHA256Hash(hashString);

            // Formulate standard 3D Secure HTML form redirection
            string htmlForm = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <title>3D Secure Yönlendirme</title>
                </head>
                <body onload='document.payForm.submit();'>
                    <div style='text-align: center; margin-top: 100px; font-family: sans-serif; color: #333;'>
                        <h2>Banka 3D Secure ekranına yönlendiriliyorsunuz...</h2>
                        <p>Lütfen bekleyin ve bu sayfayı kapatmayın.</p>
                    </div>
                    <form name='payForm' method='POST' action='{callbackUrl}'>
                        <input type='hidden' name='clientid' value='{clientId}' />
                        <input type='hidden' name='amount' value='{amountStr}' />
                        <input type='hidden' name='oid' value='{orderCode}' />
                        <input type='hidden' name='okUrl' value='{okUrl}' />
                        <input type='hidden' name='failUrl' value='{failUrl}' />
                        <input type='hidden' name='rnd' value='{rnd}' />
                        <input type='hidden' name='hash' value='{signature}' />
                        <input type='hidden' name='storetype' value='{storeType}' />
                        <input type='hidden' name='pan' value='{cleanCard}' />
                        <input type='hidden' name='Eexpiry' value='{request.ExpireYear}{request.ExpireMonth}' />
                        <input type='hidden' name='customerName' value='{request.CustomerName}' />
                        <input type='hidden' name='customerPhone' value='{request.CustomerPhone}' />
                        <input type='hidden' name='mock3d' value='true' />
                        <noscript>
                            <input type='submit' value='Devam Etmek İçin Tıklayın' />
                        </noscript>
                    </form>
                </body>
                </html>
            ";

            return Content(htmlForm, "text/html", Encoding.UTF8);
        }

        [HttpPost("callback")]
        [Consumes("application/x-www-form-urlencoded")]
        [AllowAnonymous]
        public IActionResult PaymentCallback([FromForm] IFormCollection form)
        {
            string response = form["Response"]; 
            string orderId = form["oid"];
            string authCode = form["AuthCode"];
            string errMessage = form["ErrMsg"];
            
            if (string.IsNullOrEmpty(response) && form["mock3d"] == "true")
            {
                response = "Approved";
                authCode = "MOCKAUTH" + new Random().Next(1000, 9999);
            }

            if (response == "Approved")
            {
                if (int.TryParse(orderId, out int dbOrderId))
                {
                    var order = _context.Orders.Find(dbOrderId);
                    if (order != null)
                    {
                        order.Status = "Talep Alındı";
                        _context.SaveChanges();
                    }
                }
                return Redirect($"https://www.mete-morali.com/odeme-sonuc.html?status=success&oid=MM-{orderId}&auth={authCode}");
            }
            else
            {
                if (int.TryParse(orderId, out int dbOrderId))
                {
                    var order = _context.Orders.Find(dbOrderId);
                    if (order != null)
                    {
                        order.Status = "Ödeme Başarısız";
                        _context.SaveChanges();
                    }
                }
                return Redirect($"https://www.mete-morali.com/odeme-sonuc.html?status=fail&oid=MM-{orderId}&error={Uri.EscapeDataString(errMessage ?? "Bilinmeyen hata")}");
            }
        }

        private string CalculateSHA256Hash(string input)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder builder = new StringBuilder();
                foreach (byte b in bytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }
}
