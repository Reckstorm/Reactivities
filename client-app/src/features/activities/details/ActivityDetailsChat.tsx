import { observer } from 'mobx-react-lite'
import { Segment, Header, Comment, Loader, Dimmer } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';
import { useStore } from '../../../app/stores/store';
import { useEffect } from 'react';

interface Props {
    activityId: string | undefined;
}

export default observer(function ActivityDetailsChat({ activityId }: Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) commentStore.createHubConnection(activityId);
        return () => commentStore.clearComments();
    }, [commentStore.clearComments, activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached clearing>
                <Comment.Group>
                    <Formik
                        onSubmit={(values, { resetForm }) => commentStore.addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={Yup.object({ body: Yup.string().required() })}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{ position: 'relative' }}>
                                            <Dimmer active={isSubmitting} inverted={true}>
                                                <Loader />
                                            </Dimmer>
                                            <textarea
                                                rows={2}
                                                placeholder='Enter a comment (Enter to submit, SHIFT + Enter to start a new line)'
                                                {...props.field}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.shiftKey) return;
                                                    if (e.key === 'Enter' && !e.shiftKey && isValid) {
                                                        e.preventDefault();
                                                        handleSubmit();
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </Field>
                            </Form>
                        )}
                    </Formik>
                    {commentStore.comments.map((comment) => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)}</div>
                                </Comment.Metadata>
                                <Comment.Text style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>

    )
})

