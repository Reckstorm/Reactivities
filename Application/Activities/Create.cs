using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity);
            }
        }
        
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                AppUser user = _context.Users.FirstOrDefault(u => u.UserName == _userAccessor.GetUsername());

                ActivityAttendee attendee = new ActivityAttendee()
                {
                    Activity = request.Activity,
                    AppUser = user,
                    IsHost = true
                };

                request.Activity.Attendees.Add(attendee);
                
                _context.Activities.Add(request.Activity);
                bool result = await _context.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to create an activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
