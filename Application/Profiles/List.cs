using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class List
    {
        public class Query: IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string HostUsername { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var query = _context.Activities
                    .Where(a => a.Attendees.Any(aa => aa.AppUser.UserName == request.HostUsername))
                    .OrderByDescending(a => a.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                if (request.Predicate == "past") 
                    query = query.Where(a => a.Date < DateTime.Now);
                else if (request.Predicate == "host")
                    query = query.Where(a => a.HostUsername == request.HostUsername);
                else
                    query = query.Where(a => a.Date > DateTime.Now);

                var result = await query.ToListAsync();

                if (result == null) return null;

                return Result<List<UserActivityDto>>.Success(result);
            }
        }
    }
}
