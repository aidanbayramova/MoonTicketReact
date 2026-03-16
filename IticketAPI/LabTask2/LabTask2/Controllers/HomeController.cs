using Microsoft.AspNetCore.Mvc;

namespace LabTask2.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
