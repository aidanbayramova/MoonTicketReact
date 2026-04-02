using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class NewsAuthor : BaseEntity
    {
        public string FullName { get; set; }
        public ICollection<News> News { get; set; }
    }
}
