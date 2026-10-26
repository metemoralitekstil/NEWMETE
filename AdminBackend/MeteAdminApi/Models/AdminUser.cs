using System;
using System.ComponentModel.DataAnnotations;

namespace MeteAdminApi.Models
{
    public class AdminUser
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        
        [Required]
        [MaxLength(50)]
        public string Username { get; set; } = string.Empty;
        
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        
        [MaxLength(20)]
        public string Role { get; set; } = "Admin";
    }
}