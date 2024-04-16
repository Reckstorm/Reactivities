import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Button, Grid, Header, TabPane } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Profile } from "../../app/models/profile";
import ProfileEditForm from "./ProfileEditForm";


export default observer(function ProfileAbout() {
    const { profileStore: { isCurrentUser, updateProfile, profile } } = useStore();
    const [editMode, setEditMode] = useState(false);

    function handleUpdateProfile(profile: Partial<Profile>){
        updateProfile(profile).then(() => setEditMode(false));
    }

    return (
        <TabPane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='user' content={`About ${profile?.displayName}`} />
                    {isCurrentUser && (
                        <Button
                            basic
                            floated="right"
                            content={editMode ? 'Cancel' : 'Edit profile'}
                            onClick={() => setEditMode(!editMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editMode ?
                    <ProfileEditForm profile={profile!} handleUpdateProfile={handleUpdateProfile}/> 
                    : <span style={{whiteSpace: 'pre-wrap'}}>{profile!.bio}</span>}
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})

