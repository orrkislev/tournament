import { useEffect, useState } from "react"
import { useRecoilState, useRecoilValue } from "recoil"
import { judgeAtom, nextJudgeAtom, userDataAtom } from "../utils/atoms"
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




export default function Judge(props) {
    const user = useRecoilValue(userDataAtom)
    const [judgeData, setjudgeData] = useRecoilState(judgeAtom)
    const taskData = useTaskData()

    useEffect(() => {
        if (!props.game) newPair()
        else {
            let game = taskData.data.games.find(g => g.participant1 == props.game.id1 && g.participant2 == props.game.id2)
            if (!game) game = taskData.data.games.find(g => g.participant1 == props.game.id2 && g.participant2 == props.game.id1)
            if (game && game.winner != null) setjudgeData({ pair: [game.participant1, game.participant2], selected: game.winner, message: null, isDisplay: true, judge: game.judge })
            else setjudgeData({ pair: null, selected: null, message: null, isDisplay: false })
        }
    }, [user, props])

    function newPair() {
        const newJudgeData = { pair: null, selected: null, message: null, isDisplay: false }

        const myJudgedGames = taskData.data.games.filter(g => g.judge == user.uid)
        const answerCount = Object.keys(taskData.data.answers).length
        const maxGames = (answerCount - 1) / 2
        if (myJudgedGames.filter(g => 'winner' in g).length >= maxGames * 1.2) {
            newJudgeData.message = 'אין עוד משחקים לדירוג'
            setjudgeData(newJudgeData)
            return
        }

        const myUnjudgedGames = myJudgedGames.filter(g => !('winner' in g))
        if (myUnjudgedGames.length > 0) {
            newJudgeData.pair = [myUnjudgedGames[0].participant1, myUnjudgedGames[0].participant2]
            setjudgeData(newJudgeData)
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
            newJudgeData.pair = selectedPair
        } else {
            newJudgeData.message = 'אין עוד משחקים לדירוג'
        }
        setjudgeData(newJudgeData)
    }



    if (!judgeData) return null
    if (judgeData.message) return (
        <Section info title="שיפוט">
            <div>{judgeData.message}</div>
        </Section>
    )
    if (!judgeData.pair) return null


    const judgingArea = (
        <PairContainer>
            <JudgeAnswer pairIndex={0} selectVal={1} />
            <JudgeAnswer tie selectVal={0} />
            <JudgeAnswer pairIndex={1} selectVal={2} />

            <AnswerComments pairIndex={0} />
            <AnswerComments tie />
            <AnswerComments pairIndex={1} />
        </PairContainer>
    )

    if (props.game) return (
        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
            <div>judge: {taskData.data.answers[judgeData.judge].email}</div>
            {judgingArea}
        </div>
    )

    return (
        <Section action title="שיפוט">
            {judgeData.pair && judgingArea}
            {judgeData.selected != null && <Button onClick={() => newPair()}>השיפוט הבא</Button>}
        </Section>
    )
}

function JudgeAnswer(props) {
    const taskData = useTaskData()
    const [judgeData, setjudgeData] = useRecoilState(judgeAtom)

    let answerText = 'תיקו'
    if (props.pairIndex != null) answerText = taskData.data.answers[judgeData.pair[props.pairIndex]].text

    let state = 'none'
    if (judgeData.selected != null) {
        state = 'disabled'
        if (judgeData.selected == props.selectVal) state = 'won'
        else state = 'lost'
    }

    async function select(id) {
        await taskData.updateJudge(judgeData.pair, props.selectVal)
        setjudgeData({ ...judgeData, selected: props.selectVal })
    }

    return (
        <SingleContainer onClick={state == 'none' ? select : () => { }}>
            <SingleText state={state}>{answerText}</SingleText>
        </SingleContainer>
    )
}

function AnswerComments(props) {
    const [comment, setComment] = useState('')
    const judgeData = useRecoilValue(judgeAtom)
    const taskData = useTaskData()

    if (props.tie) return <div></div>

    const answer = taskData.data.answers[judgeData.pair[props.pairIndex]]

    const clickComment = () => {
        if (comment == '') return
        taskData.saveComment(judgeData.pair[props.pairIndex], comment)
        setComment('')
    }

    return (
        <SingleContainer>
            {judgeData.isDisplay == false && (
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