using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.SubCategory;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class SubCategoryService :ISubCategoryService
    {
        private readonly ISubCategoryRepository _repository;
        private readonly ICategoryRepository _categoryRepository; 
        private readonly IMapper _mapper;

        public SubCategoryService(
            ISubCategoryRepository repository,
            ICategoryRepository categoryRepository,
            IMapper mapper)
        {
            _repository = repository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SubCategoryDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();

            // CategoryName-i manual əlavə edirik
            var dtos = new List<SubCategoryDto>();
            foreach (var sc in entities)
            {
                var category = await _categoryRepository.GetByIdAsync(sc.CategoryId);
                dtos.Add(new SubCategoryDto
                {
                    Id = sc.Id,
                    Name = sc.Name,
                    CategoryName = category?.Name // əgər category tapılmasa null
                });
            }

            return dtos;
        }

        public async Task<SubCategoryDto> GetByIdAsync(int id)
        {
            var sc = await _repository.GetByIdAsync(id);
            if (sc == null)
                throw new Exception("SubCategory tapılmadı");

            var category = await _categoryRepository.GetByIdAsync(sc.CategoryId);

            return new SubCategoryDto
            {
                Id = sc.Id,
                Name = sc.Name,
                CategoryName = category?.Name
            };
        }

        public async Task CreateAsync(SubCategoryCreateDto dto)
        {
            // CategoryName ilə Category tapılır
            var category = await _categoryRepository.GetByNameAsync(dto.CategoryName);
            if (category == null)
                throw new Exception($"Category '{dto.CategoryName}' tapılmadı");

            var entity = _mapper.Map<SubCategory>(dto);
            entity.CategoryId = category.Id; // ID server tərəfindən təyin olunur

            await _repository.CreateAsync(entity);
        }

        public async Task EditAsync(SubCategoryEditDto dto)
        {
            var entity = await _repository.GetByIdAsync(dto.Id);
            if (entity == null)
                throw new Exception("SubCategory tapılmadı");

            entity.Name = dto.Name;

            // CategoryName ilə Category tapılır
            var category = await _categoryRepository.GetByNameAsync(dto.CategoryName);
            if (category == null)
                throw new Exception($"Category '{dto.CategoryName}' tapılmadı");

            entity.CategoryId = category.Id;

            await _repository.UpdateAsync(entity);
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                throw new Exception("SubCategory tapılmadı");

            await _repository.DeleteAsync(entity);
        }
    }
}
