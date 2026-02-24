using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Repository.Data;
using Repository.Repositories.Interfaces;

namespace Repository.Repositories
{
    public class SubCategoryRepository : BaseRepository<SubCategory> ,ISubCategoryRepository
    {
        public SubCategoryRepository(AppDbContext context) : base(context) { }
      
    }
  
}
