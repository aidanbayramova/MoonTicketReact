using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.Product
{
    public class ProductEditDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }

        public IFormFile Image { get; set; }
        public IFormFile Video { get; set; }

        [Required]
        public string Address { get; set; }
        public int AgeRestriction { get; set; }

        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public TimeSpan StartTime { get; set; }

        [Required]
        public int CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
        [Required]
        public int PersonId { get; set; }
        public List<int> LanguageIds { get; set; }

        public List<SelectListItemDto> Categories { get; set; }
        public List<SelectListItemDto> SubCategories { get; set; }
        public List<SelectListItemDto> Persons { get; set; }
        public List<SelectListItemDto> Languages { get; set; }

        public string CategoryName { get; set; }
        public string SubCategoryName { get; set; }
        public string PersonName { get; set; }
        public List<string> SelectedLanguageNames { get; set; }
    }
}
