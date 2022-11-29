import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import useTaskData from "../utils/useTaskData"
import Button from '@mui/material/Button';
import styled from "styled-components";
import Section from "../components/Section";
import { AccountCircle } from "@mui/icons-material";
import CheckIcon from '@mui/icons-material/Check';

const PairContainer = styled.div`
    display: grid;
    grid-template-columns: 7fr 1fr 7fr;
    gap: 0.3rem;
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




export default function Judge() {
    const user = useRecoilValue(userDataAtom)
    const taskData = useTaskData()
    const [pair, setPair] = useState(null)
    const [done, setDone] = useState(false)
    const [saved, setSaved] = useState(null)

    useEffect(() => {
        setPair(null)
        setDone(false)
        newPair()
    }, [user])

    function newPair() {
        setSaved(null)
        setPair(null)

        const myJudgedGames = taskData.data.games.filter(g => g.judge == user.uid)
        const answerCount = Object.keys(taskData.data.answers).length
        const maxGames = (answerCount - 1) / 2
        if (myJudgedGames.filter(g => 'winner' in g).length >= maxGames * 1.2) {
            setDone('אין עוד משחקים לדירוג')
            taskData.setData({ ...taskData.data, finishedJudging: true })
            return
        }

        const myUnjudgedGames = myJudgedGames.filter(g => !('winner' in g))
        if (myUnjudgedGames.length > 0) {
            setPair([myUnjudgedGames[0].participant1, myUnjudgedGames[0].participant2])
            return
        }


        const allPairings = []
        const students = Object.keys(taskData.data.answers).filter(uid => uid !== user.uid)
        for (let i = 0; i < students.length; i++) {
            for (let j = i + 1; j < students.length; j++) {
                if (taskData.data.games.find(game => game.participant1 == students[i] && game.participant2 == students[j])) continue
                if (taskData.data.games.find(game => game.participant1 == students[j] && game.participant2 == students[i])) continue
                allPairings.push([students[i], students[j]])
            }
        }
        if (allPairings.length > 0) {
            const seenPlayers = new Set()
            myJudgedGames.forEach(g => {
                seenPlayers.add(g.participant1)
                seenPlayers.add(g.participant2)
            })
            allPairings.sort((a, b) => {
                const aSeen = seenPlayers.has(a[0]) + seenPlayers.has(a[1])
                const bSeen = seenPlayers.has(b[0]) + seenPlayers.has(b[1])
                if (aSeen == bSeen) return Math.random() - 0.5
                return aSeen - bSeen
            })
            const selectedPair = allPairings[0]
            taskData.startJudge(selectedPair)
            setPair(selectedPair)
        } else {
            setDone('אין עוד משחקים לדירוג')
            taskData.setData({ ...taskData.data, finishedJudging: true })
        }
        setSaved(null)
    }

    async function select(id) {
        await taskData.updateJudge(pair, id)
        console.log('set saved', id)
        setSaved(id)
    }

    function saveComment(id, comment) {
        taskData.saveComment(pair[id], comment)
    }

    return (
        <Section action={done == false} info={done != false} title="שיפוט">
            {done && <div>{done}</div>}

            {pair && (
                <>
                    <PairContainer>
                        <JudgeAnswer
                            answer={taskData.data.answers[pair[0]]}
                            onClick={() => select(1)}
                            disable={saved != null}
                            selected={saved == 1}
                            onComment={txt => saveComment(0, txt)} />

                        <JudgeAnswer
                            answer={{ text: 'תיקו' }}
                            onClick={() => select(0)}
                            selected={saved == 0}
                            disable={saved != null}
                            tie />

                        <JudgeAnswer
                            answer={taskData.data.answers[pair[1]]}
                            onClick={() => select(2)}
                            disable={saved != null}
                            selected={saved == 2}
                            onComment={txt => saveComment(1, txt)} />

                        <AnswerComments
                            answer={taskData.data.answers[pair[0]]}
                            id={pair[0]}
                            addComment={saved != null}
                        />

                        <AnswerComments tie />

                        <AnswerComments
                            answer={taskData.data.answers[pair[1]]}
                            id={pair[1]}
                            addComment={saved != null}
                        />


                    </PairContainer>
                </>

            )}

            {saved != null && <Button onClick={() => newPair()}>שיפוט הבא</Button>}


        </Section>
    )
}

function JudgeAnswer(props) {

    let state = 'none'
    if (props.disable) {
        state = 'disabled'
        if (props.selected) state = 'won'
        else state = 'lost'
    }

    return (
        <SingleContainer onClick={state == 'none' ? props.onClick : () => { }}>
            <SingleText state={state}>{props.answer.text}</SingleText>
        </SingleContainer>
    )
}

function AnswerComments(props) {
    const [comment, setComment] = useState('')
    const taskData = useTaskData()

    if (props.tie) return <div></div>

    const clickComment = () => {
        taskData.saveComment(props.id, comment)
    }

    return (
        <SingleContainer>
            <CommentInputContainer>
                <CommentInput value={comment} onChange={e => setComment(e.target.value)} placeholder="הוסף הערה" />
                <CommentSubmit onClick={clickComment}><CheckIcon /></CommentSubmit>
            </CommentInputContainer>
            {props.answer.comments.map((c, i) =>
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