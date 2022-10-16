import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import AdminUserSelect from '../components/AdminUserSelect';
import Header from '../components/Header';
import { MainContainer, Main } from '../styles/Styles';
import { userDataAtom } from '../utils/atoms';
import { auth } from '../utils/firebaseConfig';
import Login from './Login';

export default function App(props) {

    const [user, loading, error] = useAuthState(auth);
    const [userData, setUserData] = useRecoilState(userDataAtom);

    useEffect(() => {
        if (user) setUserData({ email: user.email, uid: user.uid, displayName: user.displayName })
    }, [user, setUserData])

    if (!user && !userData.email) return <Login />

    return (
        <>
            <AdminUserSelect />
            <MainContainer>
                <Main>
                    <Header />
                    {props.children}
                </Main>
            </MainContainer>
        </>
    )
}
