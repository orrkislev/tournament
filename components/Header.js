import { useRecoilValue } from "recoil";
import { userDataAtom } from "../utils/atoms";
import styled from "styled-components";
import { signOut } from "../utils/firebaseConfig";
import { useRouter } from "next/router";
import { Button } from "../styles/Styles";

const HeaderDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4rem;
    `;

export default function Header() {
    const user = useRecoilValue(userDataAtom)
    const router = useRouter()

    return (
        <HeaderDiv>
            <Button onClick={()=>router.push('/')}>Hi, {user.email}</Button>
            <Button onClick={signOut}>Logout</Button>
        </HeaderDiv>
    )
}