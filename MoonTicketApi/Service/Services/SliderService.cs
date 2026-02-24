using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Slider;
using Service.DTOs.Admin.Sliders;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class SliderService : ISliderService
    {
        private readonly ISliderRepository _sliderRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public SliderService(ISliderRepository sliderRepository,
                             IFileService fileService,
                             IMapper mapper)
        {
            _sliderRepository = sliderRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task<IEnumerable<SliderDto>> GetAllAsync()
        {
            var sliders = await _sliderRepository.GetAllAsync();

            var last3 = sliders
                .OrderByDescending(s => s.Id) 
                .Take(3);

            return _mapper.Map<IEnumerable<SliderDto>>(last3);
        }


        public async Task<SliderDto> GetByIdAsync(int id)
        {
            var slider = await _sliderRepository.GetByIdAsync(id);
            if (slider == null) return null;
            return _mapper.Map<SliderDto>(slider);
        }

        public async Task CreateAsync(SliderCreateDto model)
        {
            var slider = _mapper.Map<Slider>(model);

            if (model.Image != null)
                slider.Image = await _fileService.SaveFileAsync(model.Image, "Sliders");

            await _sliderRepository.CreateAsync(slider);
        }

        public async Task EditAsync(SliderEditDto model, int id)
        {
            var slider = await _sliderRepository.GetByIdAsync(id);
            if (slider == null) throw new Exception("Slider not found");

            if (model.Image != null)
            {
                if (!string.IsNullOrEmpty(slider.Image))
                {
                    string oldFileName = Path.GetFileName(slider.Image);
                    _fileService.DeleteFile(oldFileName, "Sliders");
                }

                slider.Image = await _fileService.SaveFileAsync(model.Image, "Sliders");
            }

            slider.Title = model.Title;
            slider.SubTitle = model.SubTitle;
            slider.Desc = model.Desc;

            await _sliderRepository.UpdateAsync(slider);
        }


        public async Task DeleteAsync(int id)
        {
            var slider = await _sliderRepository.GetByIdAsync(id);
            if (slider == null) throw new Exception($"Slider with ID {id} not found.");

            if (!string.IsNullOrEmpty(slider.Image))
            {
                string fileName = Path.GetFileName(slider.Image);
                _fileService.DeleteFile(fileName, "Sliders");
            }

            await _sliderRepository.DeleteAsync(slider);
        }
    }
}
