import { LinearProgress } from "@mui/material";
import useTaskData from "../utils/useTaskData";
import Section from "./Section";

export default function TaskProgress(){
    const taskData = useTaskData()

    if (taskData.data.phase != 2) return null

    return (
        <Section info>
        <LinearProgress variant="determinate" value={taskData.getLeagueProgress()}/>
        </Section>
    )
}