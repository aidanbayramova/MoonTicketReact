using AutoMapper;
using Domain.Entities;
using Service.DTOs.Admin.Category;
using Service.DTOs.Admin.Language;
using Service.DTOs.Admin.Person;
using Service.DTOs.Admin.Product;
using Service.DTOs.Admin.Settings;
using Service.DTOs.Admin.Slider;
using Service.DTOs.Admin.Sliders;
using Service.DTOs.Admin.SubCategory;

namespace Service.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<SliderCreateDto, Slider>();
            CreateMap<SliderEditDto, Slider>();
            CreateMap<Slider, SliderDto>();


            CreateMap<SettingCreateDto, Setting>()
                .ForMember(dest => dest.BannerImg, opt => opt.Ignore())
                .ForMember(dest => dest.AboutImg, opt => opt.Ignore())
                .ForMember(dest => dest.Video, opt => opt.Ignore());
            CreateMap<SettingEditDto, Setting>()
                .ForMember(dest => dest.BannerImg, opt => opt.Ignore())
                .ForMember(dest => dest.AboutImg, opt => opt.Ignore())
                .ForMember(dest => dest.Video, opt => opt.Ignore());
            CreateMap<Setting, SettingDto>();
            CreateMap<Setting, SettingDetailDto>();



            CreateMap<Language, LanguageDto>();
            CreateMap<LanguageCreateDto, Language>();
            CreateMap<LanguageEditDto, Language>();

            CreateMap<Person, PersonDto>();
            CreateMap<PersonCreateDto, Person>();
            CreateMap<LanguageEditDto, Language>();



            CreateMap<Category, CategoryDto>();

            CreateMap<CategoryCreateDto, Category>()
                .ForMember(dest => dest.Image, opt => opt.Ignore())
                .ForMember(dest => dest.Video, opt => opt.Ignore());

            CreateMap<CategoryEditDto, Category>()
                .ForMember(dest => dest.Image, opt => opt.Ignore())
                .ForMember(dest => dest.Video, opt => opt.Ignore());


            CreateMap<SubCategory, SubCategoryDto>()
              .ForMember(dest => dest.CategoryName,
                         opt => opt.MapFrom(src => src.Category.Name));

            CreateMap<SubCategoryCreateDto, SubCategory>()
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            CreateMap<SubCategoryEditDto, SubCategory>()
                .ForMember(dest => dest.CategoryId, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());



            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.SubCategoryName,
                    opt => opt.MapFrom(src => src.SubCategory != null ? src.SubCategory.Name : null))
                .ForMember(dest => dest.PersonName,
                    opt => opt.MapFrom(src => src.Person.Name))
                .ForMember(dest => dest.Languages,
                    opt => opt.MapFrom(src => src.ProductLanguages.Select(pl => pl.Language.Name).ToList()));

            CreateMap<Product, ProductDetailDto>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.SubCategoryName,
                    opt => opt.MapFrom(src => src.SubCategory != null ? src.SubCategory.Name : null))
                .ForMember(dest => dest.PersonName,
                    opt => opt.MapFrom(src => src.Person.Name))
                .ForMember(dest => dest.Languages,
                    opt => opt.MapFrom(src => src.ProductLanguages.Select(pl => pl.Language.Name).ToList()));

            CreateMap<Product, ProductCreateDto>()
      .ForMember(dest => dest.CategoryName,
          opt => opt.MapFrom(src => src.Category.Name))
      .ForMember(dest => dest.SubCategoryName,
          opt => opt.MapFrom(src => src.SubCategory != null ? src.SubCategory.Name : null))
      .ForMember(dest => dest.PersonName,                
          opt => opt.MapFrom(src => src.Person.Name))
      .ForMember(dest => dest.SelectedLanguageNames,
          opt => opt.MapFrom(src => src.ProductLanguages.Select(pl => pl.Language.Name).ToList()))
      .ForMember(dest => dest.Categories, opt => opt.Ignore())
      .ForMember(dest => dest.SubCategories, opt => opt.Ignore())
      .ForMember(dest => dest.Persons, opt => opt.Ignore())
      .ForMember(dest => dest.Languages, opt => opt.Ignore()); 

            CreateMap<Product, ProductEditDto>()
                .ForMember(dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.SubCategoryName,
                    opt => opt.MapFrom(src => src.SubCategory != null ? src.SubCategory.Name : null))
                .ForMember(dest => dest.PersonName,
                    opt => opt.MapFrom(src => src.Person.Name))
                .ForMember(dest => dest.SelectedLanguageNames,
                    opt => opt.MapFrom(src => src.ProductLanguages.Select(pl => pl.Language.Name).ToList()))
                .ForMember(dest => dest.Categories, opt => opt.Ignore())    
                .ForMember(dest => dest.SubCategories, opt => opt.Ignore()) 
                .ForMember(dest => dest.Persons, opt => opt.Ignore())       
                .ForMember(dest => dest.Languages, opt => opt.Ignore());    

            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.ProductLanguages, opt => opt.Ignore())
                .ForMember(dest => dest.Image, opt => opt.Ignore())
                .ForMember(dest => dest.Video, opt => opt.Ignore());

            CreateMap<ProductEditDto, Product>()
                .ForMember(dest => dest.ProductLanguages, opt => opt.Ignore())
                .ForMember(dest => dest.Image, opt => opt.Ignore())
                .ForMember(dest => dest.Video, opt => opt.Ignore());

        }
    }
}
