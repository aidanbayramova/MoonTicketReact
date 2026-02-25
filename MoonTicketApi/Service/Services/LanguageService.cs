using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Repository.Repositories;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Language;
using Service.DTOs.Admin.Person;
using Service.Services.Interfaces;

namespace Service.Services
{
        public class LanguageService : ILanguageService
        {
            private readonly ILanguageRepository _languageRepository;
            private readonly IMapper _mapper;

            public LanguageService(ILanguageRepository languageRepository,
                                   IMapper mapper)
            {
                _languageRepository = languageRepository;
                _mapper = mapper;
            }

            public async Task<IEnumerable<LanguageDto>> GetAllAsync()
            {
                var languages = await _languageRepository.GetAllAsync();
                return _mapper.Map<IEnumerable<LanguageDto>>(languages);
            }

            public async Task<LanguageDto> CreateAsync(LanguageCreateDto model)
            {
                var language = _mapper.Map<Language>(model);

                await _languageRepository.CreateAsync(language);
                await _languageRepository.SaveChangesAsync();

                return _mapper.Map<LanguageDto>(language);
            }

            public async Task EditAsync(LanguageEditDto model, int id)
            {
                var language = await _languageRepository.GetByIdAsync(id);
                if (language == null)
                    throw new KeyNotFoundException("Language not found");

                _mapper.Map(model, language);
                await _languageRepository.UpdateAsync(language);
                await _languageRepository.SaveChangesAsync();
            }

            public async Task DeleteAsync(int id)
            {
                var language = await _languageRepository.GetByIdAsync(id);
                if (language == null)
                    throw new KeyNotFoundException("Language not found");

                await _languageRepository.DeleteAsync(language);
                await _languageRepository.SaveChangesAsync();
            }
        public async Task<LanguageDto> GetByIdAsync(int id)
        {
            var language = await _languageRepository.GetByIdAsync(id);

            if (language == null)
                return null;

            return _mapper.Map<LanguageDto>(language);
        }
    }
}





