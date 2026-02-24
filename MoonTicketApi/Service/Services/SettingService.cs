using AutoMapper;
using Domain.Entities;
using Repository.Repositories.Interfaces;
using Service.DTOs.Admin.Settings;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class SettingService : ISettingService
    {
        private readonly ISettingRepository _settingRepository;
        private readonly IFileService _fileService;
        private readonly IMapper _mapper;

        public SettingService(
            ISettingRepository settingRepository,
            IFileService fileService,
            IMapper mapper)
        {
            _settingRepository = settingRepository;
            _fileService = fileService;
            _mapper = mapper;
        }

        public async Task CreateAsync(SettingCreateDto model)
        {
            var setting = _mapper.Map<Setting>(model);

            if (model.BannerImg != null)
                setting.BannerImg = await _fileService.SaveFileAsync(
                    model.BannerImg, "Uploads/settings");

            if (model.AboutImg != null)
                setting.AboutImg = await _fileService.SaveFileAsync(
                    model.AboutImg, "Uploads/settings");

            if (model.Video != null)
                setting.Video = await _fileService.SaveFileAsync(
                    model.Video, "Uploads/videos");

            await _settingRepository.CreateAsync(setting);
        }

        public async Task EditAsync(SettingEditDto model, int id)
        {
            var setting = await _settingRepository.GetByIdAsync(id);
            if (setting == null)
                throw new Exception("Setting not found");

            _mapper.Map(model, setting);

            if (model.BannerImg != null)
            {
                _fileService.DeleteFile(setting.BannerImg, "Uploads/settings");
                setting.BannerImg = await _fileService.SaveFileAsync(
                    model.BannerImg, "Uploads/settings");
            }

            if (model.AboutImg != null)
            {
                _fileService.DeleteFile(setting.AboutImg, "Uploads/settings");
                setting.AboutImg = await _fileService.SaveFileAsync(
                    model.AboutImg, "Uploads/settings");
            }

            if (model.Video != null)
            {
                _fileService.DeleteFile(setting.Video, "Uploads/videos");
                setting.Video = await _fileService.SaveFileAsync(
                    model.Video, "Uploads/videos");
            }

            await _settingRepository.UpdateAsync(setting);
        }

        public async Task<IEnumerable<SettingDto>> GetAllAsync()
        {
            var settings = await _settingRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<SettingDto>>(settings);
        }

        public async Task<SettingDto> GetByIdAsync(int id)
        {
            var setting = await _settingRepository.GetByIdAsync(id);
            if (setting == null)
                throw new Exception("Setting not found");

            return _mapper.Map<SettingDto>(setting);
        }
    }
}
