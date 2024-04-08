import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import { Link } from "react-router-dom";
import { Card, Icon, Image } from "semantic-ui-react";

interface Props{
    profile: Profile;
}

export default observer(function ProfileCard({profile}: Props){
    function truncate(str: string, length: number = 40){
        return str.length > length? (str.substring(0, length) + '...') : str;
    }

    return(
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{profile.bio && truncate(profile.bio)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user'/>
                20 followers
            </Card.Content>
        </Card>
    );
})