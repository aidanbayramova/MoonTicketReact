using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.Settings
{
    public class SettingCreateDto
    {
        public string WebsiteName { get; set; }
        public string FooterDesc { get; set; }

        public IFormFile BannerImg { get; set; }
        public IFormFile AboutImg { get; set; }

        public string AboutTitle { get; set; }
        public string AboutDescription { get; set; }

        public IFormFile Video { get; set; }

        public string ContactTitleOne { get; set; }
        public string ContactTitleTwo { get; set; }

        public string Email { get; set; }
        public string Number { get; set; }
    }
}
