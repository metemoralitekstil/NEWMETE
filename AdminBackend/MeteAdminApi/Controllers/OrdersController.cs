using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MeteAdminApi.Models;
using Microsoft.EntityFrameworkCore;

namespace MeteAdminApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .OrderByDescending(o => o.OrderDate)
                .ToList();
                
            return Ok(orders);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public IActionResult GetById(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            // Check if requester is authenticated as an Admin/SuperAdmin
            if (User.Identity != null && User.Identity.IsAuthenticated && (User.IsInRole("SuperAdmin") || User.IsInRole("Admin")))
            {
                return Ok(order);
            }

            // For guests/clients checking their order status, return a safe DTO containing only order status/date
            return Ok(new
            {
                Id = order.Id,
                Status = order.Status,
                OrderDate = order.OrderDate
            });
        }

        public class OrderItemDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
            public decimal UnitPrice { get; set; }
        }

        public class OrderCreateDto
        {
            public string CustomerName { get; set; } = string.Empty;
            public string CustomerPhone { get; set; } = string.Empty;
            public decimal TotalAmount { get; set; }
            public List<OrderItemDto> Items { get; set; } = new();
        }

        [HttpPost]
        [AllowAnonymous]
        public IActionResult Create([FromBody] OrderCreateDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.CustomerName) || string.IsNullOrWhiteSpace(dto.CustomerPhone))
            {
                return BadRequest(new { message = "Eksik veya geçersiz sipariş verileri." });
            }

            var order = new Order
            {
                CustomerName = dto.CustomerName,
                CustomerPhone = dto.CustomerPhone,
                TotalAmount = dto.TotalAmount,
                Status = "Talep Alındı",
                OrderDate = DateTime.UtcNow,
                OrderItems = dto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            return Ok(order);
        }

        public class StatusUpdateDto { public string Status { get; set; } }

        [HttpPut("{id}/status")]
        public IActionResult UpdateStatus(int id, [FromBody] StatusUpdateDto dto)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            order.Status = dto.Status;
            _context.SaveChanges();
            return Ok(order);
        }
    }
}