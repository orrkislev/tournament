import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { judgeAtom, userDataAtom } from "../utils/atoms"
import useTaskData from "../utils/useTaskData"
import Button from '@mui/material/Button';
import styled from "styled-components";
import Section from "../components/Section";
import { AccountCircle } from "@mui/icons-material";
import CheckIcon from '@mui/icons-material/Check';
import useResponsive from "../utils/useResponsive";
import useGame from "../utils/useGame";

const PairContainer = styled.div`
    display: grid;
    grid-template-columns: 7fr 1fr 7fr;
    gap: 0.3rem;
    @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
    `;
const SingleContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
    height:100%;
    `;
const SingleText = styled.div`
    height:100%;
    min-height: 5em;
    color: white;
    font-size: 0.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #555;
    padding: 1em 2em;
    border-radius: 5px;
    cursor: pointer;
    white-space: pre-line;

    @media (max-width: 768px) {
        font-size: 0.7rem;
        padding: 0.5em;
        min-height: 0;
    }

    &:hover { background-color: #777; }
    ${props => props.state == 'won' && `
        background-color: #cfc;
        cursor: default;
        color: black;
        &:hover { background-color: #cfc; }
    `}
    ${props => props.state == 'lost' && `
        background-color: #fcc;
        cursor: default;
        color: #333;
        &:hover { background-color: #fcc; }
    `}
    ${props => props.state == 'disabled' && `
        background-color: #ccc;
        cursor: default;
        color: #333;
        &:hover { background-color: #ccc; }
    `}
    `;

export const SingleComment = styled.div`
    display: flex;
    gap:0.3rem;
    font-style: italic;
    font-size: 0.8rem;
    align-items: center;
    `;

const CommentInputContainer = styled.div`
    display: flex;
    gap: 0.3rem;
    `;
const CommentInput = styled.input`
    width: 100%;
    padding: 0.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    `;
const CommentSubmit = styled(Button)`
    margin-top: 0.5rem;
    `;




export default function Judge(props) {
    const game = useGame()
    const taskData = useTaskData()
    const responsive = useResponsive()

    useEffect(() => {
        if (props.game) game.setGame(props.game)
        else if (!game.data) game.getGame()
    }, [props])


    if (game.message) return (
        <Section info title="שיפוט">
            <div>{game.message}</div>
        </Section>
    )
    if (!game.data) return null


    const judgingArea = (
        <PairContainer>
            <JudgeAnswer data={game.data.first} />
            <JudgeAnswer tie />
            <JudgeAnswer data={game.data.second} />

            {responsive.isMobile && game.readyToSubmit() &&
                <Button onClick={() => game.submitWinner()}>שלח</Button>
            }

            {responsive.isDesktop && (
                <>
                    <AnswerComments id={game.data.first.id} />
                    <AnswerComments tie />
                    <AnswerComments id={game.data.second.id} />
                </>
            )}
        </PairContainer>
    )

    if (props.game) {
        if (!game.data) return null
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {taskData.data.answers[game.judge] && <div>judge: {taskData.data.answers[game.judge].email}</div>}
                {judgingArea}
            </div>
        )
    }

    return (
        <Section action title="שיפוט">
            {judgingArea}
            {game.isDone() && <Button onClick={() => game.getGame()}>השיפוט הבא</Button>}
        </Section>
    )
}

function JudgeAnswer(props) {
    const game = useGame()

    async function select() {
        game.select(props.data?.id || 'tie')
    }

    let answerText = props.data ? props.data.text : 'תיקו'
    let state = props.data?.state || 'none'
    if (props.tie) state = game.data.tie || 'none'

    return (
        <SingleContainer onClick={select}>
            <SingleText state={state}>{answerText}</SingleText>
        </SingleContainer>
    )
}

function AnswerComments(props) {
    const [comment, setComment] = useState('')
    const game = useGame()
    const taskData = useTaskData()

    if (props.tie) return <div></div>
    if (!props.id) return <div></div>

    const answer = taskData.data.answers[props.id]

    const clickComment = () => {
        if (comment == '') return
        taskData.saveComment(props.id, comment)
        setComment('')
    }

    return (
        <SingleContainer>
            {game.isDisplay == false && (
                <CommentInputContainer>
                    <CommentInput value={comment} onChange={e => setComment(e.target.value)} placeholder="הוסף הערה" />
                    <CommentSubmit onClick={clickComment}><CheckIcon /></CommentSubmit>
                </CommentInputContainer>
            )}
            {answer.comments.map((c, i) =>
                < AnswerComment key={i} comment={c} />
            )}
        </SingleContainer>
    )
}

export function AnswerComment(props) {
    return (
        <SingleComment>
            <AccountCircle size="small" />
            {props.comment}
        </SingleComment>
    )
}