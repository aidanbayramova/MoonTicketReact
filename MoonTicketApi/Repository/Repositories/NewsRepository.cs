using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Repository.Data;
using Repository.Repositories.Interfaces;

namespace Repository.Repositories
{
    public class NewsRepository : BaseRepository<News>, INewsRepository
    {
        public NewsRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<List<News>> GetAllWithAuthorAsync()
        {
            return await _context.News
                .Include(x => x.NewsAuthor)
                .ToListAsync();
        }

        public async Task<News> GetByIdWithAuthorAsync(int id)
        {
            return await _context.News
                .Include(x => x.NewsAuthor)
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}
