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

    [HttpPut]
    public async Task<IActionResult> UpdateProfile(ProfileDto profile)
    {
        return HandleResult(await Mediator.Send(new Edit.Command() { Profile = profile }));
    }

    [HttpGet("{username}/activities")]
    public async Task<IActionResult> GetProfileActivities([FromQuery] string predicate, string username)
    {
        return HandleResult(await Mediator.Send(new List.Query { Predicate = predicate, HostUsername = username }));
    }
}