using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

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
    public async Task<IActionResult> GetProfileActivities([FromQuery] UserActivityParams param)
    {
        return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
    }
}