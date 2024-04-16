import { observer } from 'mobx-react-lite'
import { Segment, Header, Comment, Loader, Dimmer } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import { Formik, Form, Field, FieldProps } from 'formik';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';
import { ChatComment } from '../../../app/models/comment';

interface Props {
    addComment: (values: { body: string, activityId?: string }) => Promise<void>;
    comments: ChatComment[];
}

export default observer(function ActivityDetailsChat({ addComment, comments }: Props) {

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
                        onSubmit={(values, { resetForm }) => addComment(values).then(() => resetForm())}
                        initialValues={{ body: '' }}
                        validationSchema={Yup.object({ body: Yup.string().required() })}
                    >
                        {({ isSubmitting, isValid, handleSubmit }) => (
                            <Form className='ui form'>
                                <Field name='body'>
                                    {(props: FieldProps) => (
                                        <div style={{ position: 'relative' }}>
                                            <Dimmer active={isSubmitting} >
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
                    {comments.map((comment) => (
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

