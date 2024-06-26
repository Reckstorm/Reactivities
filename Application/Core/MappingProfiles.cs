﻿using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o =>
                    o.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName));
            CreateMap<Activity, Profiles.UserActivityDto>()
                .ForMember(d => d.HostUsername, o =>
                    o.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName));
            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers
                    .Any(x => x.Observer.UserName == currentUsername)))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.Bio, o => o.MapFrom(s => string.IsNullOrEmpty(s.Bio) ? "" : s.Bio));
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers
                    .Any(x => x.Observer.UserName == currentUsername)));
            CreateMap<Profiles.ProfileDto, AppUser>();
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(p => p.IsMain).Url));
        }
    }
}
