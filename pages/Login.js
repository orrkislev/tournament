import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebaseConfig';

export default function Login() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    if (error) return <div>Error: {error.message}</div>
    if (loading) return <p>Loading...</p>;
    if (user) return <p>Signed In User: {user.email}</p>

    return (
        <div className="App">
            <button onClick={() => signInWithGoogle()}>Sign In</button>
        </div>
    );
};