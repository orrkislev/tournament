import { useEffect, useState } from "react"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import useTaskData from "../utils/useTaskData"
import Button from '@mui/material/Button';

export default function Judge() {
    const user = useRecoilValue(userDataAtom)
    const taskData = useTaskData()
    const [pair, setPair] = useState(null)
    const [message, setMessage] = useState(null)

    useEffect(() => {
        setPair(null)
        setMessage(null)
        newPair()
    }, [user, newPair, setMessage, setPair])

    function newPair() {
        const myJudgedGames = taskData.data.games.filter(g => g.judge == user.email)
        const answerCount = Object.keys(taskData.data.answers).length
        const maxGames = (answerCount - 1) / 2
        if (myJudgedGames.filter(g => g.winner).length >= maxGames * 1.2) {
            setMessage('you have already judged multiple games')
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
        } else {
            setMessage('no more pairs to judge')
        }
    }

    async function select(id) {
        await taskData.updateJudge(pair, id)
        setPair(null)
        setMessage('vote saved')
    }

    return (
        <div>
            <h1>Judge</h1>

            {message && <div>{message}</div>}

            {!pair && !message && <div>loading...</div>}

            {pair && (
                <div>
                    <div>{taskData.data.title}</div>
                    <div>{taskData.data.text}</div>
                    <div>judge: {user.email}</div>
                    <div>1 : {taskData.data.answers[pair[0]]}</div>
                    <div>2 : {taskData.data.answers[pair[1]]}</div>
                    <Button onClick={() => select(1)}>1</Button>
                    <Button onClick={() => select(2)}>2</Button>
                </div>
            )}

            {message == 'vote saved' && <Button onClick={() => newPair()}>next</Button>}
        </div>
    )
}