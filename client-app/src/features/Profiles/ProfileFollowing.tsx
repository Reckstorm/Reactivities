import { observer } from "mobx-react-lite";
import { CardGroup, Grid, Header, TabPane } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import ProfileCard from "./ProfileCard";

export default observer(function ProfileAbout() {
    const { profileStore: { followings, loadingFollowings, profile, activeTab } } = useStore();

    return (
        <TabPane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='user' content={activeTab === 3 ? `People following ${profile?.displayName}` : `People ${profile?.displayName} follows`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <CardGroup itemsPerRow={4}>
                        {followings && followings.map(following => (
                            <ProfileCard key={following.username} profile={following} />
                        ))}
                    </CardGroup>
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})
