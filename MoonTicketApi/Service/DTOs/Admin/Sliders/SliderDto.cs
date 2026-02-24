using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.Admin.Slider
{
    public class SliderDto
    {
        public int Id { get; set; }
        public string SubTitle { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public string Image { get; set; }
        public DateTime DateTime { get; set; }= DateTime.Now;
    }
}
