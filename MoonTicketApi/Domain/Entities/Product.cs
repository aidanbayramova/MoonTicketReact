using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Product :BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Video { get; set; }
        public string Address { get; set; } 
        public int AgeRestriction { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; } 
        public TimeSpan StartTime { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int PersonId { get; set; }
        public Person Person { get; set; }
        public int? SubCategoryId { get; set; }
        public SubCategory SubCategory { get; set; }

        public ICollection<ProductLanguage> ProductLanguages { get; set; }

    }
}
