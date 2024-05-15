using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Profiles
{
    public class List
    {
        public class Query: IRequest<Result<PagedList<UserActivityDto>>>
        {
            public UserActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<PagedList<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(a => a.Attendees.Any(aa => aa.AppUser.UserName == request.Params.HostUsername))
                    .OrderByDescending(a => a.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                if (request.Params.Predicate == "past") 
                    query = query.Where(a => a.Date < DateTime.UtcNow);
                else if (request.Params.Predicate == "host")
                    query = query.Where(a => a.HostUsername == request.Params.HostUsername);
                else
                    query = query.Where(a => a.Date > DateTime.UtcNow);

                if (query == null) return null;

                return Result<PagedList<UserActivityDto>>
                    .Success(await PagedList<UserActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize));
            }
        }
    }
}
