using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MoonTicketApi.Models.Auth;
using Service.Services.Interfaces;

namespace MoonTicketApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly IEmailService _emailService;

        public AuthController(UserManager<ApplicationUser> userManager,
                              SignInManager<ApplicationUser> signInManager,
                              IConfiguration config,
                              IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _config = config;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var validationErrors = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .Where(e => !string.IsNullOrWhiteSpace(e))
                        .ToList();

                    return BadRequest(new
                    {
                        success = false,
                        message = validationErrors.FirstOrDefault() ?? "Invalid registration data",
                        errors = validationErrors
                    });
                }

                var exists = await _userManager.FindByEmailAsync(request.Email);
                if (exists != null)
                {
                    return BadRequest(new { success = false, message = "User already exists" });
                }

                var user = new ApplicationUser
                {
                    UserName = request.UserName,
                    Email = request.Email,
                    FullName = request.FullName
                };

                var result = await _userManager.CreateAsync(user, request.Password);

                if (!result.Succeeded)
                {
                    var identityErrors = result.Errors.Select(x => x.Description).ToList();

                    return BadRequest(new
                    {
                        success = false,
                        message = identityErrors.FirstOrDefault() ?? "Registration failed",
                        errors = identityErrors
                    });
                }

                await _userManager.AddToRoleAsync(user, "Member");

                var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(emailConfirmationToken));

                var frontendBaseUrl = (_config["FrontendBaseUrl"] ?? "http://localhost:5173").TrimEnd('/');
                var confirmUrl = $"{frontendBaseUrl}/confirm-email?email={Uri.EscapeDataString(user.Email ?? string.Empty)}&token={Uri.EscapeDataString(encodedToken)}";

                var emailBody = $@"
                    <div style='font-family:Arial,sans-serif;line-height:1.6;color:#1f2937;'>
                        <h2 style='margin-bottom:8px;'>Hello {user.FullName},</h2>
                        <p style='margin-top:0;'>Thanks for registering on Moon Ticket.</p>
                        <p>Please confirm your email by clicking the button below:</p>
                        <p style='margin:24px 0;'>
                            <a href='{confirmUrl}' style='background:#640c0c;color:#ffffff;padding:12px 20px;text-decoration:none;border-radius:6px;display:inline-block;font-weight:600;'>
                                Confirm Email
                            </a>
                        </p>
                        <p>If the button does not work, copy and paste this link into your browser:</p>
                        <p><a href='{confirmUrl}'>{confirmUrl}</a></p>
                    </div>";

                await _emailService.SendAsync(
                    user.Email,
                    "Confirm your Moon Ticket account",
                    emailBody
                );

                return Ok(new
                {
                    success = true,
                    message = "Registration successful. Please verify your email."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    message = ex.Message 
                });
            }
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string email, string token)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(token))
            {
                return BadRequest(new { success = false, message = "Email or token is missing" });
            }

            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                return BadRequest(new { success = false, message = "User not found" });
            }

            if (!user.EmailConfirmed)
            {
                string decodedToken;
                try
                {
                    decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
                }
                catch
                {
                    return BadRequest(new { success = false, message = "Invalid confirmation token" });
                }

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);

                if (!result.Succeeded)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = result.Errors.Select(e => e.Description).FirstOrDefault() ?? "Invalid token"
                    });
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            var jwt = GenerateToken(user, roles);

            return Ok(new
            {
                success = true,
                message = "Email confirmed successfully",
                token = jwt,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.UserName,
                    user.FullName,
                    roles
                }
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (request == null)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Login payload is missing"
                });
            }

            var identifier = (request.Identifier ?? request.Email)?.Trim();

            if (string.IsNullOrWhiteSpace(identifier) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Email/username and password are required"
                });
            }

            ApplicationUser? user;
            if (identifier.Contains("@"))
            {
                user = await _userManager.FindByEmailAsync(identifier);
            }
            else
            {
                user = await _userManager.FindByNameAsync(identifier);
            }

            if (user == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid credentials"
                });
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Email not confirmed"
                });
            }

            var checkPassword = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

            if (!checkPassword.Succeeded)
            {
                return Unauthorized(new
                {
                    success = false,
                    message = "Invalid credentials"
                });
            }

            var roles = await _userManager.GetRolesAsync(user);

            var token = GenerateToken(user, roles);

            return Ok(new
            {
                success = true,
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.UserName,
                    roles
                }
            });
        }

        private string GenerateToken(ApplicationUser user, IList<string> roles)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim(ClaimTypes.Name, user.UserName ?? "")
            };

            foreach (var role in roles)
            {
                if (string.IsNullOrWhiteSpace(role))
                {
                    continue;
                }

                var trimmedRole = role.Trim();
                claims.Add(new Claim(ClaimTypes.Role, trimmedRole));

                var canonicalRole = NormalizeRoleName(trimmedRole);
                if (!string.Equals(trimmedRole, canonicalRole, StringComparison.Ordinal))
                {
                    claims.Add(new Claim(ClaimTypes.Role, canonicalRole));
                }
            }

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["JwtSettings:SecretKey"])
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["JwtSettings:Issuer"],
                audience: _config["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static string NormalizeRoleName(string role)
        {
            return role.Trim().ToLowerInvariant() switch
            {
                "admin" => "Admin",
                "superadmin" => "SuperAdmin",
                "member" => "Member",
                "user" => "User",
                _ => role.Trim()
            };
        }
    }
}