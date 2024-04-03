﻿using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos;

public class SetMain
{
    public class Command : IRequest<Result<Unit>>
    {
        public string Id { get; set; }
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
            var user = await _context.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

            if (user == null || user.Photos == null) return null;
            
            var photo = user.Photos.FirstOrDefault(p => p.Id == request.Id);

            if (photo == null) return null;

            var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);

            if (currentMain != null) currentMain.IsMain = false;
            
            photo.IsMain = true;

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Result<Unit>.Success(Unit.Value);
            
            return Result<Unit>.Failure("Problem setting a main photo");
        }
    }
}