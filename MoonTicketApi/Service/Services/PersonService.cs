using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Language;
using Service.DTOs.Admin.Person;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class PersonService : IPersonService
    {
        private readonly IPersonRepository _personRepository;
        private readonly IMapper _mapper;

        public PersonService(IPersonRepository personRepository,
                               IMapper mapper)
        {
            _personRepository = personRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<PersonDto>> GetAllAsync()
        {
            var people = await _personRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<PersonDto>>(people);
        }

        public async Task<PersonDto> CreateAsync(PersonCreateDto model)
        {
            var person = _mapper.Map<Person>(model);

            await _personRepository.CreateAsync(person);
            await _personRepository.SaveChangesAsync();

            return _mapper.Map<PersonDto>(person);
        }

        public async Task EditAsync(PersonEditDto model, int id)
        {
            var person = await _personRepository.GetByIdAsync(id);
            if (person == null)
                throw new KeyNotFoundException("Person not found");

            _mapper.Map(model, person);
            await _personRepository.UpdateAsync(person);
            await _personRepository.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var person = await _personRepository.GetByIdAsync(id);
            if (person == null)
                throw new KeyNotFoundException("Person not found");

            await _personRepository.DeleteAsync(person);
            await _personRepository.SaveChangesAsync();
        }
    }
}
