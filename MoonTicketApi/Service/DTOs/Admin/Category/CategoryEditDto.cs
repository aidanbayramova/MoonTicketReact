using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.Category
{
    public class CategoryEditDto
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public IFormFile? Image { get; set; }
        public IFormFile? Video { get; set; }
    }
}
