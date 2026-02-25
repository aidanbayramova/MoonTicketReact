using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Repository.Data;
using Repository.Repositories;
using Repository.Repositories.Interfaces;
using Service.Helpers;
using Service.Services;
using Service.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

//
//  CONTROLLERS
//
builder.Services.AddControllers();

//
//  DATABASE
//
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("Default")
    );
});

//
// AUTOMAPPER
//
builder.Services.AddAutoMapper(typeof(MappingProfile));

//
//  REPOSITORIES
//
builder.Services.AddScoped<ISliderRepository, SliderRepository>();
builder.Services.AddScoped<ISettingRepository, SettingRepository>();
builder.Services.AddScoped<ILanguageRepository, LanguageRepository>();
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISubCategoryRepository, SubCategoryRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();

//
//  SERVICES
//
builder.Services.AddScoped<ISliderService, SliderService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<ISettingService, SettingService>();
builder.Services.AddScoped<ILanguageService, LanguageService>();
builder.Services.AddScoped<IPersonService, PersonService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ISubCategoryService, SubCategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin();
        });
});

//
//  SWAGGER
//
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//
//  PIPELINE
//
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//
// ?? Static files (image üçün)
//
app.UseStaticFiles();

//
// ?? CORS
//
app.UseCors("AllowReact");

//
// ?? AUTH (h?l? JWT yoxdursa problem deyil)
//
app.UseAuthorization();

app.MapControllers();

app.Run();
