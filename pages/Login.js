import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import { userDataAtom } from '../utils/atoms';
import { auth } from '../utils/firebaseConfig';

export default function Login() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
    const [userData, setUserData] = useRecoilState(userDataAtom);

    if (error) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>
        );
    }
    if (loading) {
        return <p>Loading...</p>;
    }
    if (user) {
        return (
            <div>
                <p>Signed In User: {user.email}</p>
            </div>
        );
    }
    return (
        <div className="App">
            <button onClick={() => signInWithGoogle()}>Sign In</button>
        </div>
    );
};