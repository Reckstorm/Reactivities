import { observer } from "mobx-react-lite";
import { Grid, Header, Tab, TabPane } from "semantic-ui-react";
import ProfileEventCards from "./ProfileEventCards";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";

export default observer(function ProfileEventsContent() {
    const {profileStore} = useStore();
    const {userActivities, loadingActivities, setEventsActiveTab} = profileStore;

    const panes = [
        {
            menuItem: 'Future Events', render: () => 
            <TabPane className="innerTabPane" loading={loadingActivities} active>
                <ProfileEventCards userActivities={userActivities!} />
            </TabPane>
        },
        {
            menuItem: 'Past Events', render: () => 
            <TabPane className="innerTabPane" loading={loadingActivities}>
                <ProfileEventCards userActivities={userActivities!} />
            </TabPane>
        },
        {
            menuItem: 'Hosting', render: () => 
            <TabPane className="innerTabPane" loading={loadingActivities}>
                <ProfileEventCards userActivities={userActivities!} />
            </TabPane>
        }];

        useEffect(() => {
            setEventsActiveTab(0);
            return () => setEventsActiveTab(5);
        }, [])

    return (
        <TabPane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='calendar' content={`Activities`} />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Tab
                        menu={{ secondary: true, pointing: true }}
                        panes={panes}
                        onTabChange={(_, data) => setEventsActiveTab(data.activeIndex as number)}
                    >
                    </Tab>
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})