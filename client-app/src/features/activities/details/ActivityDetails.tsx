import { Image, Card, CardContent, CardHeader, CardMeta, CardDescription, Button } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default function ActivityDetails() {
    const {activityStore} = useStore();
    const {selectedActivity: activity, openForm, cancelSelectedActivity} = activityStore;
    
    if(!activity) return <LoadingComponent/>;

    return (
        <Card fluid>
            <Image src={`public/assets/categoryImages/${activity.category}.jpg`} />
            <CardContent>
                <CardHeader>{activity.title}</CardHeader>
                <CardMeta>
                    <span>{activity.date}</span>
                </CardMeta>
                <CardDescription>
                    {activity.description}
                </CardDescription>
            </CardContent>
            <CardContent extra>
                <Button.Group widths='2'>
                    <Button basic color="blue" content='Edit' onClick={()=> openForm(activity.id)}/>
                    <Button basic color="grey" content='Cancel' onClick={cancelSelectedActivity}/>
                </Button.Group>
            </CardContent>
        </Card>
    )
}