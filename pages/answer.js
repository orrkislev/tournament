import { useEffect, useState } from "react"
import useTaskData from "../utils/useTaskData"
import styled from 'styled-components'
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../utils/atoms";
import { Button } from "../styles/Styles"
import Section from "../components/Section";
import { AnswerComment } from "./Judge";


export default function Answer() {
    const user = useRecoilValue(userDataAtom)
    const taskData = useTaskData()

    if (!taskData.data) return null

    return (
        <Section title="התשובה שלי" action={taskData.data.phase == 1} info={taskData.data.phase == 2}>

            {taskData.data.phase == 1 ? (
                <AnswerFill />
            ) : (
                <AnswerDisplay answer={taskData.data.answers[user.uid]} />
            )}

        </Section>
    )
}

export function AnswerDisplay({ answer }) {
    return (
        <>
            <div style={{ whiteSpace: 'pre-line' }}>{answer.text}</div>
            {answer.comments.map((c, i) => <AnswerComment key={i} comment={c} />)}
        </>
    )
}






const InputText = styled.textarea`
    width: 100%;
    margin-bottom: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: .5em;
    background-color: #00000011;
    border: none;
    border-radius: 5px;
    min-height: 100px;
    white-space: pre-wrap;
    &:focus {
        outline: none;
    }
`

function AnswerFill() {
    const user = useRecoilValue(userDataAtom)
    const [text, setText] = useState('')
    const [saved, setSaved] = useState(false)
    const taskData = useTaskData()

    useEffect(() => {
        if (user.uid in taskData.data.answers) setText(taskData.data.answers[user.uid].text)
    }, [taskData.data])

    useEffect(() => {
        if (taskData.data && user.uid in taskData.data.answers)
            setText(taskData.data.answers[user.uid].text)
        else setText('')
    }, [user.uid])

    const save = async () => {
        taskData.saveAnswer(text)
        setSaved(true)
    }

    return (
        <div>
            <InputText type="text" value={text} onChange={e => setText(e.target.value)} rows="4" />
            <Button onClick={save}>{saved ? 'התשובה נשמרה' : 'שמירה'}</Button>
        </div>
    )
}