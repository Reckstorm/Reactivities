using FluentValidation;

namespace Application.Profiles;

public class ProfileValidator: AbstractValidator<ProfileDto>
{
    public ProfileValidator()
    {
        RuleFor(x => x.DisplayName).NotEmpty();
    }
}