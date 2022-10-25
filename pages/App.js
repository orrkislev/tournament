import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';
import AdminUserSelect from '../components/AdminUserSelect';
import Header from '../components/Header';
import { userDataAtom } from '../utils/atoms';
import { auth } from '../utils/firebaseConfig';
import Login from './Login';
import styled from "styled-components";

const Main = styled.div`
    display: flex;
    flex-direction: column;
    `;
const MainContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    `;

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
            <Main>
                <Header />
                <MainContainer>
                    {props.children}
                </MainContainer>
            </Main>
        </>
    )
}
