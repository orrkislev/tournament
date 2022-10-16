import { useEffect, useState } from "react"
import useTaskData from "../utils/useTaskData"
import Task from '../components/Task'
import styled from 'styled-components'
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../utils/atoms";
import { Button } from "../styles/Styles"

const InputText = styled.textarea`
    width: 100%;
    margin-bottom: 20px;
    color: white;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid white;
    &:focus {
        outline: none;
    }
`

export default function Answer() {
    const user = useRecoilValue(userDataAtom)
    const [text, setText] = useState('')
    const [saved, setSaved] = useState(false)
    const taskData = useTaskData()

    useEffect(() => {
        if (user.email in taskData.data.answers) 
            setText(taskData.data.answers[user.email])
    }, [taskData.data])

    const save = async () => {
        taskData.saveAnswer(text)
        setSaved(text)
    }

    return (
        <div>
            <h1>Answer</h1>
            <Task />
            <InputText type="text" value={text} onChange={e => setText(e.target.value)} rows="1"/>
            <Button disabled={text==saved} onClick={save}>save</Button>
        </div>
    )
}