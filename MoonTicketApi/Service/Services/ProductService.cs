using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Repository.Data;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Product;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ProductService (IProductRepository productRepository ,AppDbContext context, IMapper mapper)
        {
            _productRepository = productRepository;
            _context = context;
            _mapper = mapper;
        }
        public async Task<List<ProductDto>> GetAllAsync()
        {
            var products = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.Person)
                .Include(p => p.ProductLanguages)
                    .ThenInclude(pl => pl.Language)
                .ToListAsync();

            return _mapper.Map<List<ProductDto>>(products);
        }

        public async Task<ProductDetailDto> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.Person)
                .Include(p => p.ProductLanguages)
                    .ThenInclude(pl => pl.Language)
                .FirstOrDefaultAsync(p => p.Id == id);

            return _mapper.Map<ProductDetailDto>(product);
        }

        public async Task<ProductDto> CreateAsync(ProductCreateDto dto)
        {
            var product = _mapper.Map<Product>(dto);

            // Many-to-Many Languages
            if (dto.LanguageIds != null && dto.LanguageIds.Any())
            {
                product.ProductLanguages = dto.LanguageIds.Select(id => new ProductLanguage
                {
                    LanguageId = id
                }).ToList();
            }

            await _context.Products.AddAsync(product);
            await _context.SaveChangesAsync();

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<ProductDto> UpdateAsync(ProductEditDto dto)
        {
            var product = await _context.Products
                .Include(p => p.ProductLanguages)
                .FirstOrDefaultAsync(p => p.Id == dto.Id);

            if (product == null)
                return null;

            _mapper.Map(dto, product);

            // Update Languages
            product.ProductLanguages.Clear();
            if (dto.LanguageIds != null && dto.LanguageIds.Any())
            {
                product.ProductLanguages = dto.LanguageIds.Select(id => new ProductLanguage
                {
                    LanguageId = id,
                    ProductId = product.Id
                }).ToList();
            }

            await _context.SaveChangesAsync();
            return _mapper.Map<ProductDto>(product);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null) return false;

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ProductCreateDto> GetCreateDataAsync()
        {
            var dto = new ProductCreateDto
            {
                Categories = await _context.Categories
                    .Select(c => new SelectListItemDto { Id = c.Id, Name = c.Name })
                    .ToListAsync(),

                SubCategories = await _context.SubCategories
                    .Select(sc => new SelectListItemDto { Id = sc.Id, Name = sc.Name })
                    .ToListAsync(),

                Persons = await _context.Persons
                    .Select(p => new SelectListItemDto { Id = p.Id, Name = p.Name })
                    .ToListAsync(),

                Languages = await _context.Languages
                    .Select(l => new SelectListItemDto { Id = l.Id, Name = l.Name })
                    .ToListAsync()
            };

            return dto;
        }

        public async Task<ProductEditDto> GetEditDataAsync(int id)
        {
            var product = await _context.Products
                .Include(p => p.ProductLanguages)
                .Include(p => p.Category)
                .Include(p => p.SubCategory)
                .Include(p => p.Person)
                .FirstOrDefaultAsync(p => p.Id == id);

            var dto = _mapper.Map<ProductEditDto>(product);

            // Fill lists
            dto.Categories = await _context.Categories
                .Select(c => new SelectListItemDto { Id = c.Id, Name = c.Name })
                .ToListAsync();

            dto.SubCategories = await _context.SubCategories
                .Select(sc => new SelectListItemDto { Id = sc.Id, Name = sc.Name })
                .ToListAsync();

            dto.Persons = await _context.Persons
                .Select(p => new SelectListItemDto { Id = p.Id, Name = p.Name })
                .ToListAsync();

            dto.Languages = await _context.Languages
                .Select(l => new SelectListItemDto { Id = l.Id, Name = l.Name })
                .ToListAsync();

            // Fill selected language names
            dto.SelectedLanguageNames = product.ProductLanguages
                .Select(pl => pl.Language.Name).ToList();

            return dto;
        }
    }
}
