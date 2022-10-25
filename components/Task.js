import EditIcon from '@mui/icons-material/Edit';
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Create from '../pages/create';
import { Button } from '../styles/Styles';
import useClickOutside from "../utils/useClickOutside";
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

    if (edit) return <Create edit onFinish={() => setEdit(false)} />

    const sideContent = (taskData.data.phase == 1 && Object.keys(taskData.data.answers).length == 0) ? (<Button onClick={() => setEdit(true)}>ערוך</Button>) : null

    return (
        <Section title="משימה" sideContent>
            <TaskTitle>{taskData.data.title}</TaskTitle>
            <TaskText>{taskData.data.text}</TaskText>
        </Section>
    )
}