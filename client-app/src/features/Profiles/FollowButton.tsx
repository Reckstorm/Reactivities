import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { useStore } from "../../app/stores/store";
import { Button, Reveal } from "semantic-ui-react";
import { SyntheticEvent } from "react";

interface Props {
    profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {
    const { profileStore, userStore } = useStore();
    const { loading, updateFollowing } = profileStore;

    function handleFollow(e: SyntheticEvent, username: string) {
        e.preventDefault();
        profile.following ? updateFollowing(username, false) : updateFollowing(username, true);
    }

    if (profile.username === userStore.user?.username) return null;

    return (
        <Reveal animated="move">
            <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                    fluid
                    color="teal"
                    content={profile.following ? "Following" : "Not Following"}
                />
            </Reveal.Content>
            <Reveal.Content hidden style={{ width: '100%' }}>
                <Button
                    fluid
                    basic
                    loading={loading}
                    color={profile.following ? 'red' : 'green'}
                    content={profile.following ? 'Unfollow' : 'Follow'}
                    onClick={e => handleFollow(e, profile.username)}
                />
            </Reveal.Content>
        </Reveal>
    )
})