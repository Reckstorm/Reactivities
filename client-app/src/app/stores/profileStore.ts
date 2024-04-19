import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Photo, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    loadingFollowings = false;
    followings: Profile[] = [];
    activeTab = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            (activeTab) => {
                if (activeTab === 3 || activeTab === 4) {
                    activeTab === 3 ? this.loadFollowings("followers") : this.loadFollowings("following");
                }
            })
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab
    }
    
    get isCurrentUser() {
        if (store.userStore.user?.username === this.profile?.username) {
            return store.userStore.user?.username === this.profile?.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            });
        } catch (error) {
            console.log(error);
        };
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.post(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain) this.profile.image = photo.url;
                    if (photo.isMain && store.userStore.user) store.userStore.setImage(photo.url);
                    this.uploading = false;
                }
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            store.activityStore.updateAttendeeMainPhoto(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.delete(photo.id);
            runInAction(() => {
                if (this.profile && this.profile.photos)
                    this.profile.photos = this.profile.photos.filter(p => p.id != photo.id);
                runInAction(() => this.loading = false);
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        const updatedProfile = profile as Profile;
        try {
            await agent.Profiles.update(profile);
            runInAction(() => {
                if (this.profile) {
                    this.profile.displayName = updatedProfile.displayName;
                    this.profile.bio = updatedProfile.bio;
                }
                if (store.userStore.user) {
                    store.userStore.setDisplayName(updatedProfile.displayName);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.username !== store.userStore.user?.username && this.profile.username === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                if (this.profile && this.profile.username === store.userStore.user?.username){
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }
                this.followings.forEach((profile) => {
                    profile.following ? profile.followersCount-- : profile.followersCount++;
                    profile.following = !profile.following;
                })
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loadingFollowings = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = followings;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loadingFollowings = false);
        }
    }
}