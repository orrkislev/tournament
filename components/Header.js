import { useRecoilValue } from "recoil";
import { taskDataAtom, userDataAtom } from "../utils/atoms";
import styled from "styled-components";
import { signOut } from "../utils/firebaseConfig";
import { useRouter } from "next/router";
import { Button } from "../styles/Styles";

const HeaderDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    `;
const HeaderRight = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    `;
const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
    `;

export default function Header() {
    const user = useRecoilValue(userDataAtom)
    const taskData = useRecoilValue(taskDataAtom)
    const router = useRouter()

    return (
        <HeaderDiv>
            <HeaderRight>
                <Button onClick={() => router.push('/')}>הליגה</Button>
                {taskData && <div>{taskData.title}</div>}
            </HeaderRight>

            <HeaderLeft>
                <Button onClick={signOut}>{user.email}</Button>
            </HeaderLeft>
        </HeaderDiv>
    )
}