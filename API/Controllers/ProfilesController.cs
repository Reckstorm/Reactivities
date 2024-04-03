using API.DTOs;
using Application.Profiles;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers;

public class ProfilesController : BaseApiController
{
    [HttpGet("{username}")]
    public async Task<IActionResult> GetProfile(string username)
    {
        return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
    }
}