using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Service.Services.Interfaces;

namespace Service.Services
{
    public class FileService : IFileService
    {
        private readonly string _baseUploadPath;

        public FileService()
        {
            _baseUploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads");
        }

        public async Task<string> SaveFileAsync(IFormFile file, string folder)
        {
            if (file == null) return null;

            string folderPath = Path.Combine(_baseUploadPath, folder);
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            string fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            string filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);

            return $"/Uploads/{folder}/{fileName}";
        }

        public void DeleteFile(string fileUrl, string folder)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            string fileName = Path.GetFileName(fileUrl); 
            string folderPath = Path.Combine(_baseUploadPath, folder);
            string filePath = Path.Combine(folderPath, fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }
      
    }
}