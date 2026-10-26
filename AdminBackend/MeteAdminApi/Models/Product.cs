using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MeteAdminApi.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [MaxLength(150)]
        public string Name { get; set; } = string.Empty;
        
        [MaxLength(500)]
        public string Description { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        
        public int StockQuantity { get; set; }
        
        [MaxLength(255)]
        public string ImageUrl { get; set; } = string.Empty;
        public string Subtitle { get; set; } = string.Empty;
        
        public string Features { get; set; } = "[]";
        
        public string SubImages { get; set; } = "[]";

        public string ArticleCode { get; set; } = string.Empty;
        public string CertificateCode { get; set; } = string.Empty;
        public string Standards { get; set; } = "[]";
        public string Colors { get; set; } = "[]";
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}