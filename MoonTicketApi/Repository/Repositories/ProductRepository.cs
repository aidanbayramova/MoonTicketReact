using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Repository.Data;
using Repository.Repositories.Interfaces;

namespace Repository.Repositories
{
    public class ProductRepository : BaseRepository<Product> , IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }
      
    }
}
