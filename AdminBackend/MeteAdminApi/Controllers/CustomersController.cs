using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MeteAdminApi.Models;

namespace MeteAdminApi.Controllers
{
    [Authorize] // Require admin auth if they use JWT
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class CustomerDto
        {
            public Guid Id { get; set; }
            public string? Email { get; set; }
            public string? Phone { get; set; }
            public DateTime CreatedAt { get; set; }
            public int TotalOrders { get; set; }
            public List<OrderDto> Orders { get; set; } = new List<OrderDto>();
        }

        public class OrderDto
        {
            public int OrderId { get; set; }
            public DateTime OrderDate { get; set; }
            public decimal TotalAmount { get; set; }
            public string Status { get; set; } = string.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            var allOrders = await _context.Orders.ToListAsync();

            var customerDtos = new List<CustomerDto>();

            foreach (var c in customers)
            {
                // Find matching orders by phone or email
                var matchingOrders = allOrders.Where(o => 
                    (!string.IsNullOrEmpty(c.Phone) && o.CustomerPhone == c.Phone) ||
                    (!string.IsNullOrEmpty(c.Email) && o.CustomerName == c.Email) // Fallback if email was saved in CustomerName field
                ).ToList();

                var dto = new CustomerDto
                {
                    Id = c.Id,
                    Email = c.Email,
                    Phone = c.Phone,
                    CreatedAt = c.CreatedAt,
                    TotalOrders = matchingOrders.Count,
                    Orders = matchingOrders.Select(o => new OrderDto
                    {
                        OrderId = o.Id,
                        OrderDate = o.OrderDate,
                        TotalAmount = o.TotalAmount,
                        Status = o.Status
                    }).ToList()
                };

                customerDtos.Add(dto);
            }

            return Ok(customerDtos.OrderByDescending(c => c.CreatedAt));
        }
    }
}
