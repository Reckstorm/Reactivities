import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Card, CardGroup, Image } from "semantic-ui-react";
import { UserActivity } from "../../app/models/profile";

interface Props {
    userActivities: UserActivity[];
}

export default function ProfileEventCards({ userActivities }: Props) {
    return (
        <CardGroup itemsPerRow={4}>
            {userActivities && userActivities.map(activity => (
                <Card
                    key={activity.id}
                    className="profileEventCard"
                    as={Link} to={`/activities/${activity.id}`}
                    raised>
                    <Image
                        src={`/assets/categoryImages/${activity.category}.jpg`}
                        style={{ minHeignt: 100, objectFit: 'cover' }}
                    />
                    <Card.Content>
                        <Card.Header textAlign="center">{activity.title}</Card.Header>
                        <Card.Meta textAlign="center">
                            {format(activity.date, 'do MMM')}
                            <br />
                            {format(activity.date, 'h:mm aa')}
                        </Card.Meta>
                    </Card.Content>
                </Card>
            ))}
        </CardGroup>
    )
}