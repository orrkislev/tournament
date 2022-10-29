import { useEffect, useState } from "react"
import { newDoc } from "../utils/firebaseConfig"
import { useRouter } from "next/router"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import { TextField, Button } from '@mui/material';
import styled from 'styled-components'
import useTaskData from "../utils/useTaskData"
import Section from "../components/Section"

const CreateContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    `;


export default function Create(props) {
    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const user = useRecoilValue(userDataAtom)
    const router = useRouter()
    const taskData = useTaskData()

    useEffect(() => {
        if (props.edit) {
            setText(taskData.data.text)
            setTitle(taskData.data.title)
        }
    }, [taskData])

    const save = async () => {
        if (props.edit) {
            await taskData.update({ text, title })
            props.onFinish()
        } else {
            const docRef = await newDoc('tasks', {
                author: user.email,
                title, text, phase: 1, answers: {}
            });
            router.push(`/task?id=${docRef.id}`)
        }
    }

    return (
        <Section action title={props.edit ? "עריכה" : "משימה חדשה"} sideContent={props.edit ? <Button onClick={props.onFinish}>ביטול</Button> : null} >
            <CreateContainer>
                <TextField fullWidth placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField fullWidth placeholder="Text" value={text} onChange={(e) => setText(e.target.value)} />
                <Button onClick={save}>save</Button>
            </CreateContainer>
        </Section>
    )
}