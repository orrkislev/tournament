import { LinearProgress } from "@mui/material";
import useTaskData from "../utils/useTaskData";
import Section from "./Section";

export default function TaskProgress(){
    const taskData = useTaskData()

    if (taskData.data.phase != 2) return null

    const sumAnswers = Object.values(taskData.data.answers).length
    const totalGames = .5 * sumAnswers * (sumAnswers - 1)
    const sumGames = taskData.data.games.length
    const perc = Math.round(sumGames / totalGames * 100)

    return (
        <Section info>
        <LinearProgress variant="determinate" value={perc}/>
        </Section>
    )
}