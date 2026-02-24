using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.Admin.Settings
{
    public class SettingDetailDto
    {
        public int Id { get; set; }

        public string WebsiteName { get; set; }
        public string FooterDesc { get; set; }

        public string BannerImg { get; set; }
        public string AboutImg { get; set; }

        public string AboutTitle { get; set; }
        public string AboutDescription { get; set; }

        public string Video { get; set; }

        public string ContactTitleOne { get; set; }
        public string ContactTitleTwo { get; set; }

        public string Email { get; set; }
        public string Number { get; set; }
    }
}
