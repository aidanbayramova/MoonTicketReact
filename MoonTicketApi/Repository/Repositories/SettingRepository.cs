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
    public class SettingRepository :BaseRepository<Setting> ,ISettingRepository
    {
        public SettingRepository(AppDbContext context) : base(context) { }
     
    }
}
