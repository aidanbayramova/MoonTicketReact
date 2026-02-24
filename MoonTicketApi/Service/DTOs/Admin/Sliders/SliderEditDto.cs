using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.Sliders
{
    public class SliderEditDto
    {
        public string SubTitle { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public IFormFile? Image { get; set; }
    }
}
