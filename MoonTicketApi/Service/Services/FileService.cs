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

            // Return relative URL for use in the app
            return $"/Uploads/{folder}/{fileName}";
        }

        public void DeleteFile(string fileUrl, string folder)
        {
            if (string.IsNullOrEmpty(fileUrl)) return;

            string fileName = Path.GetFileName(fileUrl); // Extract file name from URL
            string folderPath = Path.Combine(_baseUploadPath, folder);
            string filePath = Path.Combine(folderPath, fileName);

            if (File.Exists(filePath))
                File.Delete(filePath);
        }
      
    }
}