using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MeteAdminApi.Models;

namespace MeteAdminApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public IActionResult GetSummary()
        {
            var totalProducts = _context.Products.Count();
            var totalStock = _context.Products.Sum(p => (int?)p.StockQuantity) ?? 0;
            var totalOrders = _context.Orders.Count();
            var totalRevenue = _context.Orders.Sum(o => (decimal?)o.TotalAmount) ?? 0;

            var recentOrders = _context.Orders
                .OrderByDescending(o => o.OrderDate)
                .Take(5)
                .Select(o => new { o.Id, o.CustomerName, o.TotalAmount, o.Status, o.OrderDate })
                .ToList();

            return Ok(new {
                TotalProducts = totalProducts,
                TotalStock = totalStock,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue,
                RecentOrders = recentOrders
            });
        }
    }
}