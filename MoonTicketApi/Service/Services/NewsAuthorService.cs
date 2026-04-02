using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.NewsAuthor;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class NewsAuthorService : INewsAuthorService
    {
        private readonly INewsAuthorRepository _newsAuthorRepository;
        private readonly IMapper _mapper;

        public NewsAuthorService(INewsAuthorRepository newsAuthorRepository, IMapper mapper)
        {
            _newsAuthorRepository = newsAuthorRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NewsAuthorDto>> GetAllAsync()
        {
            var authors = await _newsAuthorRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<NewsAuthorDto>>(authors);
        }

        public async Task<NewsAuthorDto> GetByIdAsync(int id)
        {
            var author = await _newsAuthorRepository.GetByIdAsync(id);
            if (author == null)
                return null;

            return _mapper.Map<NewsAuthorDto>(author);
        }

        public async Task<NewsAuthorDto> CreateAsync(NewsAuthorCreateDto model)
        {
            var author = _mapper.Map<NewsAuthor>(model);

            await _newsAuthorRepository.CreateAsync(author);
            await _newsAuthorRepository.SaveChangesAsync();

            return _mapper.Map<NewsAuthorDto>(author);
        }

        public async Task EditAsync(NewsAuthorEditDto model, int id)
        {
            var author = await _newsAuthorRepository.GetByIdAsync(id);
            if (author == null)
                throw new KeyNotFoundException("NewsAuthor not found");

            _mapper.Map(model, author);

            await _newsAuthorRepository.UpdateAsync(author);
            await _newsAuthorRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var author = await _newsAuthorRepository.GetByIdAsync(id);
            if (author == null)
                throw new KeyNotFoundException("NewsAuthor not found");

            await _newsAuthorRepository.DeleteAsync(author);
            await _newsAuthorRepository.SaveChangesAsync();
        }
    }
}
