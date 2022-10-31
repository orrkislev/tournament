import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import useTaskData from "../utils/useTaskData"
import Button from '@mui/material/Button';
import styled from "styled-components";
import Section from "../components/Section";
import { AccountCircle } from "@mui/icons-material";

const PairContainer = styled.div`
    display: flex;
    gap: 0.3rem;
    `;
const SingleContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex:7;
    ${props => props.tie && `flex:1; `}
    `;
const SingleText = styled.div`
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




export default function Judge() {
    const user = useRecoilValue(userDataAtom)
    const taskData = useTaskData()
    const [pair, setPair] = useState(null)
    const [done, setDone] = useState(false)
    const [saved, setSaved] = useState(null)

    useEffect(() => {
        setPair(null)
        newPair()
        setDone(false)
    }, [user])

    function newPair() {
        setSaved(null)
        setPair(null)
        if (!Object.keys(taskData.data.answers).includes(user.email)) {
            setDone('אי אפשר לשפוט כי אין לך תשובות')
            return
        }

        const myJudgedGames = taskData.data.games.filter(g => g.judge == user.email)
        const answerCount = Object.keys(taskData.data.answers).length
        const maxGames = (answerCount - 1) / 2
        if (myJudgedGames.filter(g => g.winner).length >= maxGames * 1.2) {
            setDone('אין עוד משחקים לשפוט')
            return
        }

        const myUnjudgedGames = myJudgedGames.filter(g => !g.winner)
        if (myUnjudgedGames.length > 0) {
            setPair([myUnjudgedGames[0].participant1, myUnjudgedGames[0].participant2])
            return
        }


        const allPairings = []
        const students = Object.keys(taskData.data.answers).filter(email => email !== user.email)
        for (let i = 0; i < students.length; i++) {
            for (let j = i + 1; j < students.length; j++) {
                if (taskData.data.games.find(game => game.participant1 == students[i] && game.participant2 == students[j])) continue
                if (taskData.data.games.find(game => game.participant1 == students[j] && game.participant2 == students[i])) continue
                allPairings.push([students[i], students[j]])
            }
        }
        if (allPairings.length > 0) {
            const selectedPair = allPairings[Math.floor(Math.random() * allPairings.length)]
            taskData.startJudge(selectedPair)
            setPair(selectedPair)
        } else setDone('סיימת לשפט את כל המשחקים')
        setSaved(null)
    }

    async function select(id) {
        await taskData.updateJudge(pair, id)
        setSaved(id)
    }

    function saveComment(id, comment) {
        taskData.saveComment(pair[id], comment)
    }

    return (
        <Section action title="שיפוט">

            {done && <div>{done}</div>}

            {pair && (
                <PairContainer>
                    <JudgeAnswer
                        answer={taskData.data.answers[pair[0]]}
                        onClick={() => select(1)}
                        comment={saved != null}
                        selected={saved == 1}
                        onComment={txt => saveComment(0, txt)} />

                    <JudgeAnswer
                        answer={{ text: 'תיקו' }}
                        onClick={() => select(0)}
                        selected={saved == 0}
                        comment={saved != null}
                        tie />

                    <JudgeAnswer
                        answer={taskData.data.answers[pair[1]]}
                        onClick={() => select(2)}
                        comment={saved != null}
                        selected={saved == 2}
                        onComment={txt => saveComment(1, txt)} />
                </PairContainer>
            )}

            {saved != null && <Button onClick={() => newPair()}>שיפוט הבא</Button>}


        </Section>
    )
}

function JudgeAnswer(props) {
    const [comment, setComment] = useState('')
    const [showComment, setShowComment] = useState(false)

    useEffect(() => {
        setComment('')
        setShowComment(props.comment)
    }, [props.comment])

    const clickComment = () => {
        setShowComment(false)
        props.onComment(comment)
    }

    let state = props.comment ?
        (props.selected ? 'won' : 'lost')
        : 'none'
    if (props.tie && props.comment && !props.selected) state = 'disabled'

    return (
        <SingleContainer onClick={state == 'none' ? props.onClick : () => { }} tie={props.tie}>
            <SingleText state={state}>{props.answer.text}</SingleText>
            {showComment && !props.tie && (
                <div>
                    <input value={comment} onChange={e => setComment(e.target.value)} />
                    <button onClick={clickComment}>comment</button>
                </div>
            )}
            {!props.tie && props.answer.comments.map((c, i) =>
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