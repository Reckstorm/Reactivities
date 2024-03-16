import { ErrorMessage, Form, Formik } from "formik";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Button, Header, Label } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";

export default observer(function LoginForm() {
    const { userStore } = useStore();
    return (
        <Formik
            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values).catch(error => setErrors({ error: 'Invalid email or password' }))}
        >
            {({ handleSubmit, isSubmitting, errors, dirty }) => (
                <Form className="ui form" autoComplete="off" onSubmit={handleSubmit}>
                    <Header as='h2' color="teal" textAlign="center" content='Login to Reactivities' />
                    <MyTextInput placeholder="Email" name="email" />
                    <MyTextInput placeholder="Password" name="password" type="password" />
                    <ErrorMessage
                        name="error"
                        render={() =>
                            <Label style={{ marginBottom: 10 }} basic color="red" content={errors.error} />
                        }
                    />
                    <Button
                        disabled={!dirty}
                        loading={isSubmitting}
                        positive
                        content="Login"
                        fluid
                        type="submit" />
                </Form>
            )}
        </Formik>
    )
})