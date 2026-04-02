using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.News
{
    public class NewsCreateDto
    {
        public string Title { get; set; }
        public string Desc { get; set; }
        public string Location { get; set; }
        [Required]
        public IFormFile Image { get; set; }
        public int NewsAuthorId { get; set; }
    }
}
