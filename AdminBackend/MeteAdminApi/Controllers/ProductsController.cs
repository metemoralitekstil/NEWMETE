using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MeteAdminApi.Models;
using System.IO;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Text.Json;

namespace MeteAdminApi.Controllers
{
    public class ProductUploadDto
    {
        public string? Name { get; set; }
        public string? Subtitle { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
        public string? Features { get; set; }
        public string? ArticleCode { get; set; }
        public string? CertificateCode { get; set; }
        public string? Standards { get; set; }
        public string? Colors { get; set; }
        public IFormFile? ImageFile { get; set; }
        public List<IFormFile>? SubImageFiles { get; set; }
    }
    public class ProductUpdateDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetAll()
        {
            return Ok(_context.Products.ToList());
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromForm] ProductUploadDto dto)
        {
            string imageUrl = "img/Mavi.png"; // Fallback image
            var imgFolder = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "img");
            
            if (!Directory.Exists(imgFolder))
            {
                Directory.CreateDirectory(imgFolder);
            }

            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(imgFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }
                imageUrl = "img/" + fileName;
            }

            List<string> subImagesList = new List<string>();
            if (dto.SubImageFiles != null && dto.SubImageFiles.Count > 0)
            {
                foreach (var file in dto.SubImageFiles)
                {
                    if (file.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(imgFolder, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        subImagesList.Add("img/" + fileName);
                    }
                }
            }

            var product = new Product
            {
                Name = dto.Name ?? "İsimsiz Ürün",
                Subtitle = dto.Subtitle ?? "",
                Description = dto.Description ?? "",
                Price = dto.Price,
                StockQuantity = dto.StockQuantity,
                Features = string.IsNullOrEmpty(dto.Features) ? "[]" : dto.Features,
                SubImages = JsonSerializer.Serialize(subImagesList),
                ImageUrl = imageUrl,
                ArticleCode = dto.ArticleCode ?? "",
                CertificateCode = dto.CertificateCode ?? "",
                Standards = string.IsNullOrEmpty(dto.Standards) ? "[]" : dto.Standards,
                Colors = string.IsNullOrEmpty(dto.Colors) ? "[]" : dto.Colors,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            
            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] ProductUploadDto dto)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return NotFound();

            product.Name = string.IsNullOrWhiteSpace(dto.Name) ? "İsimsiz Ürün" : dto.Name;
            product.Subtitle = dto.Subtitle ?? "";
            product.Description = dto.Description ?? "";
            product.Price = dto.Price;
            product.StockQuantity = dto.StockQuantity;
            product.Features = string.IsNullOrEmpty(dto.Features) ? "[]" : dto.Features;
            product.ArticleCode = dto.ArticleCode ?? "";
            product.CertificateCode = dto.CertificateCode ?? "";
            product.Standards = string.IsNullOrEmpty(dto.Standards) ? "[]" : dto.Standards;
            product.Colors = string.IsNullOrEmpty(dto.Colors) ? "[]" : dto.Colors;

            var imgFolder = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "img");
            if (!Directory.Exists(imgFolder)) Directory.CreateDirectory(imgFolder);

            // Resim güncellemesi
            if (dto.ImageFile != null && dto.ImageFile.Length > 0)
            {
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.ImageFile.FileName);
                var filePath = Path.Combine(imgFolder, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ImageFile.CopyToAsync(stream);
                }
                product.ImageUrl = "img/" + fileName;
            }

            // Alt resim güncellemeleri (Eğer yeni alt resim gelirse eskilerin üzerine ekler veya değiştirir - burada basitçe üzerine yazıyoruz)
            if (dto.SubImageFiles != null && dto.SubImageFiles.Count > 0)
            {
                var subImagesList = new List<string>();
                foreach (var file in dto.SubImageFiles)
                {
                    if (file.Length > 0)
                    {
                        var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                        var filePath = Path.Combine(imgFolder, fileName);
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            await file.CopyToAsync(stream);
                        }
                        subImagesList.Add("img/" + fileName);
                    }
                }
                product.SubImages = JsonSerializer.Serialize(subImagesList);
            }

            await _context.SaveChangesAsync();
            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);
            if (product == null) return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();
            return Ok(new { message = "Ürün silindi." });
        }
    }
}