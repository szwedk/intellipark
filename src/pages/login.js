import GoogleButton from 'react-google-button';
import useUser from '../hooks/useUser';
import { googleSignIn } from '../firebase_setup/firebase';

export default function Login() {
    const { user, loading } = useUser();

    const signIn = () => {
        googleSignIn().catch((error) => {
            // A closed popup is the user changing their mind, not a failure.
            if (error.code !== 'auth/popup-closed-by-user') console.error(error);
        });
    };

    if (loading) return <p>Loading…</p>;
    if (user) return <p>You are logged in as {user.email}</p>;

    return <GoogleButton onClick={signIn} />;
}
