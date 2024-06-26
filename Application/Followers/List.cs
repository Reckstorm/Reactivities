﻿using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Profile = Application.Profiles.Profile;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class List
{
    public class Query : IRequest<Result<List<Profile>>>
    {
        public string Username { get; set; }
        public string Predicate { get; set; }
    }

    public class Handler : IRequestHandler<Query, Result<List<Profile>>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }
        public async Task<Result<List<Profile>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var profiles = new List<Profile>();
            
            switch (request.Predicate)
            {
                case "followers":
                    profiles = await _context.UserFollowings
                        .Where(t => t.Target.UserName == request.Username)
                        .Select(u => u.Observer)
                        .ProjectTo<Profile>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUsername()})
                        .ToListAsync();
                    break;
                case "following":
                    profiles = await _context.UserFollowings
                        .Where(t => t.Observer.UserName == request.Username)
                        .Select(u => u.Target)
                        .ProjectTo<Profile>(_mapper.ConfigurationProvider, new {currentUsername = _userAccessor.GetUsername()})
                        .ToListAsync();
                    break;
            }
            
            return Result<List<Profile>>.Success(profiles);
        }
    }
}