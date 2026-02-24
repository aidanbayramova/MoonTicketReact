using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Language : BaseEntity
    {
        public string Name { get; set; }
        public ICollection<ProductLanguage> ProductLanguages { get; set; }
    }
}
