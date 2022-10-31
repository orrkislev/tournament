import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { auth } from '../utils/firebaseConfig';

export default function Login() {
    const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

    if (error) return <div>Error: {error.message}</div>
    if (loading) return <p>Loading...</p>;
    if (user) return <p>Signed In User: {user.email}</p>

    return (
        <div style={{display:'grid', placeItems:'center', height:'50vh'}}>
            <button  
                style={{padding:'1rem 2rem', borderRadius:'10px', border:'none', cursor:'pointer'}}
                onClick={signInWithGoogle}>כניסה עם חשבון גוגל
            </button>
        </div>
    );
};