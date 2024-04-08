import { observer } from "mobx-react-lite";
import { Profile } from "../../app/models/profile";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import MyTextArea from "../../app/common/form/MyTextArea";
import { Button } from "semantic-ui-react";
import { useState } from "react";

interface Props {
    profile: Profile;
    handleUpdateProfile: (profile: Partial<Profile>) => void;
}

export default observer(function ProfileEditForm({ profile, handleUpdateProfile }: Props) {
    const [partialProfile] = useState<Partial<Profile>>(profile);

    const validationSchema = Yup.object({
        displayName: Yup.string().required('Display name is required'),
    })

    return (
        <>
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={partialProfile}
                onSubmit={(values) => handleUpdateProfile(values)}>
                {({ handleSubmit, dirty, isSubmitting, isValid }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder="Display name" name='displayName' />
                        <MyTextArea rows={3} placeholder="Add your bio" name='bio'/>
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting}
                            floated="right"
                            positive 
                            type='submit'
                            content='Update profile' />
                    </Form>
                )}
            </Formik>
        </>
    )
})