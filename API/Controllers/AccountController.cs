using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly TokenService _tokenService;
    private readonly IConfiguration _config;
    private readonly HttpClient _httpClient;

    public AccountController(UserManager<AppUser> userManager, TokenService tokenService, IConfiguration config)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _config = config;
        _httpClient = new HttpClient
        {
            BaseAddress = new System.Uri("https://graph.facebook.com/v20.0/")
        };
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
    {
        var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(u => u.Email == loginDto.Email);
        if (user == null) return Unauthorized();
        var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

        if (result) return CreateUserDto(user);

        return Unauthorized();
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await _userManager.Users.AnyAsync(user => user.UserName == registerDto.Username))
        {
            ModelState.AddModelError("username", "Username taken");
            return ValidationProblem();
        }
        if (await _userManager.Users.AnyAsync(user => user.Email == registerDto.Email))
        {
            ModelState.AddModelError("email", "Email taken");
            return ValidationProblem();
        }

        var user = new AppUser()
        {
            UserName = registerDto.Username,
            DisplayName = registerDto.DisplayName,
            Email = registerDto.Email
        };

        var result = await _userManager.CreateAsync(user, registerDto.Password);

        if (result.Succeeded)
        {
            return CreateUserDto(user);
        }

        return BadRequest("Problem registering user");
    }

    [Authorize]
    [HttpGet]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));
        return CreateUserDto(user);
    }

    [AllowAnonymous]
    [HttpPost("fbLogin")]
    public async Task<ActionResult<UserDto>> FacebookLogin(string accessToken)
    {
        var verifyTokenResponse = await _httpClient.GetAsync($"debug_token?input_token={accessToken}&access_token={_config["Facebook:AppId"]}|{_config["Facebook:AppSecret"]}");

        if (!verifyTokenResponse.IsSuccessStatusCode) return Unauthorized();

        var fbUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";

        var fbData = await _httpClient.GetFromJsonAsync<FacebookDto>(fbUrl);

        var user = await _userManager.Users.Include(p => p.Photos)
            .FirstOrDefaultAsync(u => u.Email == fbData.Email);

        if (user != null) return CreateUserDto(user);

        user = new AppUser
        {
            DisplayName = fbData.Name,
            Email = fbData.Email,
            UserName = fbData.Email,
            Photos = new List<Photo>
            {
                new Photo
                {
                    Id = $"fb_{fbData.Id}",
                    Url = fbData.Picture.Data.Url,
                    IsMain = true
                }
            }
        };

        var result = await _userManager.CreateAsync(user);

        if(!result.Succeeded) return BadRequest("Problem creating user account");

        return CreateUserDto(user);
    }

    private ActionResult<UserDto> CreateUserDto(AppUser user)
    {
        return new UserDto()
        {
            DisplayName = user.DisplayName,
            Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
            Token = _tokenService.CreateToken(user),
            Username = user.UserName
        };
    }
}