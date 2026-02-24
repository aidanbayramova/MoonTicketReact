using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;


namespace Service.DTOs.Admin.Sliders
{
    public class SliderCreateDto
    {
        [Required]
        public string SubTitle { get; set; }
        [Required]

        public string Title { get; set; }
        [Required]

        public string Desc { get; set; }
        public IFormFile Image { get; set; }
    }
}
