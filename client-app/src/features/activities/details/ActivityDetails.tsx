import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";

export default observer(function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, loadActivity, loadingInitial, clearSelectedActivity} = activityStore;
    const {id}= useParams();

    useEffect(() => {
        if(id) loadActivity(id);
        return () => clearSelectedActivity();
    }, [id, loadActivity, clearSelectedActivity]);

    if(loadingInitial || !activity) return <LoadingComponent content="Loading Activity"/>;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailsHeader activity={activity}></ActivityDetailsHeader>
                <ActivityDetailsInfo activity={activity}></ActivityDetailsInfo>
                <ActivityDetailsChat activityId={activity.id}></ActivityDetailsChat>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailsSidebar activity={activity}></ActivityDetailsSidebar>
            </Grid.Column>
        </Grid>
    )
})