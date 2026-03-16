using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.Admin.Product
{
    public class ProductCreateDataDto
    {
        public List<SelectListItemDto> Categories { get; set; }
        public List<SelectListItemDto> SubCategories { get; set; }
        public List<SelectListItemDto> Persons { get; set; }
        public List<SelectListItemDto> Languages { get; set; }
    }
}
