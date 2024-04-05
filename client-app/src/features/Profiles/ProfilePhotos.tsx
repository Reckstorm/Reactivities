import { observer } from "mobx-react-lite";
import { Photo, Profile } from "../../app/models/profile";
import { Card, CardGroup, TabPane, Image, Header, Grid, Button, ButtonGroup } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { SyntheticEvent, useState } from "react";
import PhotoWidgetUpload from "../../app/common/imageUpload/PhotoWidgetUpload";

interface Props {
    profile: Profile;
}

export default observer(function ProfilePhotos({ profile }: Props) {
    const { profileStore: { isCurrentUser, uploadPhoto, uploading, loading, setMainPhoto, deletePhoto } } = useStore();
    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [target, setTarget] = useState('');

    function handlePhotoUpload(file: Blob) {
        uploadPhoto(file).then(() => setAddPhotoMode(false));
    }

    function handleSetMainPhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        setMainPhoto(photo);
    }

    function handleDeletePhoto(photo: Photo, e: SyntheticEvent<HTMLButtonElement>) {
        setTarget(e.currentTarget.name);
        deletePhoto(photo);
    }

    return (
        <TabPane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated="left" icon='image' content='Photos' />
                    {isCurrentUser && (
                        <Button
                            basic
                            floated="right"
                            content={addPhotoMode ? 'Cancel' : 'Add photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                        />
                    )}
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoWidgetUpload uploadPhoto={handlePhotoUpload} loading={uploading} />
                    ) :
                        (
                            <CardGroup itemsPerRow={5}>
                                {profile && profile.photos?.map((photo) => (
                                    <Card key={photo.id}>
                                        <Image src={photo.url} />
                                        {isCurrentUser &&
                                            <ButtonGroup fluid widths={2}>
                                                <Button
                                                    basic
                                                    color="green"
                                                    loading={loading && target === 'main'+photo.id}
                                                    disabled={photo.isMain}
                                                    onClick={(e) => handleSetMainPhoto(photo, e)}
                                                    name={'main'+photo.id}
                                                    content="Main"
                                                />
                                                <Button
                                                    basic
                                                    color="red"
                                                    loading={loading && target === photo.id}
                                                    disabled={photo.isMain}
                                                    onClick={(e) => handleDeletePhoto(photo, e)}
                                                    name={photo.id}
                                                    icon='trash'
                                                />
                                            </ButtonGroup>
                                        }
                                    </Card>
                                ))}
                            </CardGroup>
                        )
                    }
                </Grid.Column>
            </Grid>
        </TabPane>
    )
})