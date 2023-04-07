import { useState } from "react";
import styled from "styled-components";
import Create from '../pages/create';
import { Button } from '../styles/Styles';
import useTaskData from "../utils/useTaskData"
import Section from './Section';

const TaskTitle = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: .5rem;`
const TaskText = styled.div`
    font-size: .8rem;
    margin-bottom: 1rem;`


export default function Task(props) {
    const taskData = useTaskData()
    const [edit, setEdit] = useState(false)

    if (edit) return <Create edit onFinish={() => setEdit(false)} title={taskData.data.title} text={taskData.data.text} />

    // const sideContent = (taskData.data.phase == 1 && Object.keys(taskData.data.answers).length == 0) ? (<Button onClick={() => setEdit(true)}>ערוך</Button>) : null
    const sideContent = 
        taskData.userOwnsTask() ?
            (<Button onClick={() => setEdit(true)}>ערוך</Button>)
        : null

    return (
        <Section title="משימה" sideContent={sideContent}>
            <TaskTitle>{taskData.data.title}</TaskTitle>
            <TaskText>{taskData.data.text}</TaskText>
        </Section>
    )
}