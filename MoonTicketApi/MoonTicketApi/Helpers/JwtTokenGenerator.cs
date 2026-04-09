using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Service.Helpers;

namespace MoonTicketApi.Helpers
{
    public class JwtTokenGenerator
    {
        private readonly JwtSettings _settings;

        public JwtTokenGenerator(IOptions<JwtSettings> settings)
        {
            _settings = settings.Value;
        }

        public (string token, DateTime expiresAt) CreateToken(ApplicationUser user)
        {
            var expires = DateTime.UtcNow.AddMinutes(_settings.ExpireMinutes);
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
                new(ClaimTypes.NameIdentifier, user.Id),
                new("fullName", user.FullName)
            };

            return CreateTokenWithRoles(user, claims, expires);
        }

        public (string token, DateTime expiresAt) CreateToken(ApplicationUser user, IEnumerable<string> roles)
        {
            var expires = DateTime.UtcNow.AddMinutes(_settings.ExpireMinutes);
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? string.Empty),
                new(ClaimTypes.NameIdentifier, user.Id),
                new("fullName", user.FullName)
            };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            return CreateTokenWithRoles(user, claims, expires);
        }

        private (string token, DateTime expiresAt) CreateTokenWithRoles(ApplicationUser user, List<Claim> claims, DateTime expires)
        {

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _settings.Issuer,
                audience: _settings.Audience,
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            return (new JwtSecurityTokenHandler().WriteToken(token), expires);
        }
    }
}
