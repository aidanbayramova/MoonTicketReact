using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Category;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;
        private readonly IMapper _mapper;
        private readonly IFileService _fileService;

        private const string ImageFolder = "CategoryImages";
        private const string VideoFolder = "CategoryVideos";

        public CategoryService(ICategoryRepository repository, IMapper mapper, IFileService fileService)
        {
            _repository = repository;
            _mapper = mapper;
            _fileService = fileService;
        }

        public async Task<IEnumerable<CategoryDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return _mapper.Map<IEnumerable<CategoryDto>>(entities);
        }

        public async Task<CategoryDto> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new Exception("Category not found");

            return _mapper.Map<CategoryDto>(entity);
        }

        public async Task CreateAsync(CategoryCreateDto dto)
        {
            var entity = _mapper.Map<Category>(dto);

            if (dto.Image != null)
                entity.Image = await _fileService.SaveFileAsync(dto.Image, ImageFolder);

            if (dto.Video != null)
                entity.Video = await _fileService.SaveFileAsync(dto.Video, VideoFolder);

            await _repository.CreateAsync(entity);
        }

        public async Task EditAsync(CategoryEditDto dto)
        {
            var entity = await _repository.GetByIdAsync(dto.Id);
            if (entity == null)
                throw new Exception("Category not found");

            entity.Name = dto.Name;
            entity.Description = dto.Description;

            if (dto.Image != null)
            {
                if (!string.IsNullOrEmpty(entity.Image))
                    _fileService.DeleteFile(entity.Image, ImageFolder);

                entity.Image = await _fileService.SaveFileAsync(dto.Image, ImageFolder);
            }

            if (dto.Video != null)
            {
                if (!string.IsNullOrEmpty(entity.Video))
                    _fileService.DeleteFile(entity.Video, VideoFolder);

                entity.Video = await _fileService.SaveFileAsync(dto.Video, VideoFolder);
            }
            if (!Directory.Exists(ImageFolder)) Directory.CreateDirectory(ImageFolder);
            if (!Directory.Exists(VideoFolder)) Directory.CreateDirectory(VideoFolder);
            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new Exception("Category not found");

            // Delete files if exist
            _fileService.DeleteFile(entity.Image, ImageFolder);
            _fileService.DeleteFile(entity.Video, VideoFolder);

            await _repository.DeleteAsync(entity);
        }
    }
}