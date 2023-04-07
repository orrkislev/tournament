import { useRecoilValue } from "recoil";
import { userDataAtom } from "../utils/atoms";
import styled from "styled-components";
import { signOut } from "../utils/firebaseConfig";
import { useRouter } from "next/router";
import { Button } from "../styles/Styles";
import useTaskData from "../utils/useTaskData";

const HeaderDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    @media (max-width: 768px) {
        margin-bottom: 1rem;
    }
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
    const taskData = useTaskData()
    const router = useRouter()

    const home = () => {
        taskData.reset()
        router.push("/")
    }


    return (
        <>
            <HeaderDiv>
                <HeaderRight>
                    <Button onClick={home}>הליגה</Button>
                    {taskData.data && <div className="only-desktop">{taskData.data.title}</div>}
                </HeaderRight>

                <HeaderLeft>
                    <Button onClick={signOut}>{user.email}</Button>
                </HeaderLeft>
            </HeaderDiv>
        </>
    )
}