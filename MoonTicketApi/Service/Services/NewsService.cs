using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.News;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class NewsService : INewsService
    {
        private readonly INewsRepository _newsRepository;
        private readonly INewsAuthorRepository _newsAuthorRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;
        private const string ImageFolder = "NewsImages";

        public NewsService(INewsRepository newsRepository, INewsAuthorRepository newsAuthorRepository, IFileService fileService, IMapper mapper)
        {
            _newsRepository = newsRepository;
            _newsAuthorRepository = newsAuthorRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<NewsDto>> GetAllAsync()
        {
            var newsList = await _newsRepository.GetAllWithAuthorAsync();
            return _mapper.Map<IEnumerable<NewsDto>>(newsList);
        }

        public async Task<NewsDto> GetByIdAsync(int id)
        {
            var news = await _newsRepository.GetByIdWithAuthorAsync(id);
            if (news == null)
                return null;

            return _mapper.Map<NewsDto>(news);
        }

        public async Task<NewsDto> CreateAsync(NewsCreateDto model)
        {
            var author = await _newsAuthorRepository.GetByIdAsync(model.NewsAuthorId);
            if (author == null)
                throw new KeyNotFoundException("NewsAuthor not found");

            var news = _mapper.Map<News>(model);

            if (model.Image != null)
                news.Image = await _fileService.SaveFileAsync(model.Image, ImageFolder);

            await _newsRepository.CreateAsync(news);
            await _newsRepository.SaveChangesAsync();

            var createdNews = await _newsRepository.GetByIdWithAuthorAsync(news.Id);
            return _mapper.Map<NewsDto>(createdNews);
        }

        public async Task EditAsync(NewsEditDto model, int id)
        {
            var news = await _newsRepository.GetByIdAsync(id);
            if (news == null)
                throw new KeyNotFoundException("News not found");

            var author = await _newsAuthorRepository.GetByIdAsync(model.NewsAuthorId);
            if (author == null)
                throw new KeyNotFoundException("NewsAuthor not found");

            _mapper.Map(model, news);

            if (model.Image != null)
            {
                if (!string.IsNullOrEmpty(news.Image))
                    _fileService.DeleteFile(news.Image, ImageFolder);

                news.Image = await _fileService.SaveFileAsync(model.Image, ImageFolder);
            }

            await _newsRepository.UpdateAsync(news);
            await _newsRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var news = await _newsRepository.GetByIdAsync(id);
            if (news == null)
                throw new KeyNotFoundException("News not found");

            if (!string.IsNullOrEmpty(news.Image))
                _fileService.DeleteFile(news.Image, ImageFolder);

            await _newsRepository.DeleteAsync(news);
            await _newsRepository.SaveChangesAsync();
        }
    }
}
