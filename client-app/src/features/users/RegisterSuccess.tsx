import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import useQuery from "../../app/util/hooks";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function RegisterSuccess() {
    const email = useQuery().get('email') as string;

    function handleEmailConfirmResend() {
        agent.Account.resendEmailConf(email).then(() => toast.success("Verification email resent - please check your email"))
            .catch(error => console.log(error));
    }

    return (
        <Segment placeholder textAlign='center'>
            <Header icon color='green'>
                <Icon name='check'/>
                Successfully registered!
            </Header>
            <p>Please check your email (including junk email) for the verification email</p>
            {email && 
            <>
                <p>Didn't receive email? Click the below button to resend</p>
                <Button primary onClick={handleEmailConfirmResend} size='huge' content='Resend email'/>
            </>}
        </Segment>
    )
}