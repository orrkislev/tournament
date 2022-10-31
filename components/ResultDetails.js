import { useEffect, useState } from "react"
import useTaskData from "../utils/useTaskData"
import useTaskStats from "../utils/useTaskStats"

export default function ResultDetails(props) {
    const taskData = useTaskData()
    const taskStats = useTaskStats()

    return (
        <div>
            <div>{props.email}</div>
            <div>{taskData.data.answers[props.email].text}</div>

            {taskStats.stats[props.email] && taskStats.stats[props.email].games.map(game => (
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
                {textOptions[props.game.result]} {props.game.opponent}
            </div>
            {showanswer && <div style={{ marginLeft: '2em' }}>{taskData.data.answers[props.game.opponent]}.text</div>}
        </>
    )
}