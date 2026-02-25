using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.Admin.Product
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public DateTime StartDate { get; set; }
        public int AgeRestriction { get; set; }

        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public string PersonName { get; set; }
        public List<string> Languages { get; set; }
    }
}
