import { useEffect, useState } from "react"
import { AnswerDisplay } from "../pages/answer"
import useTaskData from "../utils/useTaskData"
import useTaskStats from "../utils/useTaskStats"

export default function ResultDetails(props) {
    const taskData = useTaskData()
    const taskStats = useTaskStats()

    if (!taskData) return null

    const email = taskData.data.answers[props.uid].email

    return (
        <div>
            <div>{email}</div>
            <br/>

            <AnswerDisplay answer={taskData.data.answers[props.uid]} />
            <br/>

            {taskStats.stats[props.uid] && taskStats.stats[props.uid].games.map(game => (
                <GameResult key={game.id} game={game} />
            ))}
        </div>
    )
}

function GameResult(props) {
    const taskData = useTaskData()
    const [hover, sethover] = useState(false)
    const [showanswer, setshowanswer] = useState(false)

    useEffect(() => {
        setshowanswer(false)
    }, [props])

    const textOptions = {
        'won': 'ניצחון על',
        'lost': 'הפסד מול',
        'draw': 'תיקו עם'
    }

    return (
        <>
            <div style={{ display: 'flex', gap: '2em' }} onMouseEnter={() => sethover(true)} onMouseLeave={() => sethover(false)} onClick={() => setshowanswer(!showanswer)}>
                {textOptions[props.game.result]} {taskData.data.answers[props.game.opponent].email} (שיפוט של {taskData.data.answers[props.game.judge].email})
            </div>
            {showanswer && <div style={{ marginLeft: '2em' }}>{taskData.data.answers[props.game.opponent].text}</div>}
        </>
    )
}