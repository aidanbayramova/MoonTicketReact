using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Service.DTOs.Admin.News
{
    public class NewsDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public string Location { get; set; }
        public string Image { get; set; }
        public int NewsAuthorId { get; set; }
        public string NewsAuthorFullName { get; set; }
    }
}
