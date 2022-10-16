import EditIcon from '@mui/icons-material/Edit';
import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import useClickOutside from "../utils/useClickOutside";
import useTaskData from "../utils/useTaskData"

const TaskTitle = styled.div`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: .5rem;`
const TaskText = styled.div`
    font-size: .8rem;
    margin-bottom: 1rem;`
const TaskInput = styled.input`
    background-color: white;
    color: black;
    border: none;
    `;


export default function Task(props) {
    const taskData = useTaskData()
    const [hoverTitle, setHoverTitle] = useState(false)
    const [hoverText, setHoverText] = useState(false)
    const [editTitle, setEditTitle] = useState(false)
    const [editText, setEditText] = useState(false)
    const [title, setTitle] = useState(taskData.data.title)
    const [text, setText] = useState(taskData.data.text)
    const thisRef = useRef(null)
    const clickOutside = useClickOutside(thisRef, () => {
        taskData.update({ title, text })
        setEditTitle(false)
        setEditText(false)
    })

    useEffect(() => {
        if (editText || editTitle) clickOutside.setEnabled(true)
        else clickOutside.setEnabled(false)
    }, [editText, editTitle, clickOutside])

    return (
        <div ref={thisRef}>
            {editTitle ? (
                <TaskInput value={title} onChange={e => setTitle(e.target.value)} />
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between' }} onMouseEnter={() => setHoverTitle(true)} onMouseLeave={() => setHoverTitle(false)}>
                    <TaskTitle>{title}</TaskTitle>
                    {hoverTitle && props.edit && <EditIcon onClick={() => setEditTitle(true)} />}
                </div>
            )}
            {editText ? (
                <TaskInput value={text} onChange={e => setText(e.target.value)} />
            ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between' }} onMouseEnter={() => setHoverText(true)} onMouseLeave={() => setHoverText(false)}>
                    <TaskText>{text}</TaskText>
                    {hoverText && props.edit && <EditIcon onClick={() => setEditText(true)} />}
                </div>
            )}
        </div>
    )
}