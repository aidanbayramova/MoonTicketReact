using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.Category
{
    public class CategoryCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        [Required]
        public IFormFile Image { get; set; }
        [Required]
        public IFormFile Video { get; set; }
    }
}
