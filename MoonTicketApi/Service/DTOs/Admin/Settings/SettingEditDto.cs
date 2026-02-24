using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Service.DTOs.Admin.Settings
{
    public class SettingEditDto
    {
        public string WebsiteName { get; set; }
        public bool IsShowWebsiteName { get; set; }

        public string FooterDesc { get; set; }
        public bool IsShowFooterDesc { get; set; }

        public string AboutTitle { get; set; }
        public bool IsShowAboutTitle { get; set; }

        public string AboutDescription { get; set; }
        public bool IsShowAboutDescription { get; set; }

        public string ContactTitleOne { get; set; }
        public bool IsShowContactTitleOne { get; set; }

        public string ContactTitleTwo { get; set; }
        public bool IsShowContactTitleTwo { get; set; }

        public string Email { get; set; }
        public bool IsShowEmail { get; set; }

        public string Number { get; set; }
        public bool IsShowNumber { get; set; }

        // 🔥 FILE-lar nullable OLMALIDIR
        public IFormFile? BannerImg { get; set; }
        public IFormFile? AboutImg { get; set; }
        public IFormFile? Video { get; set; }
    }
}
