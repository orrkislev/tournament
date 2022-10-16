import useTaskData from "../utils/useTaskData"
import { Button } from "../styles/Styles";
import ResultTable from "../components/ResultTable";
import Task from "../components/Task";
import { useState } from "react";
import ResultDetails from "../components/ResultDetails";

export default function Manage() {
    const taskData = useTaskData()
    const [selected, setSelected] = useState(null)

    const isOnPhase1 = taskData.data.phase == 1
    const canMoveToPhase2 = isOnPhase1 && Object.keys(taskData.data.answers).length > 2

    const moveToPhase2 = () => {
        if (canMoveToPhase2) taskData.update({ phase: 2, games: [] })
    }
    

    return (
        <div>
            <Task edit={isOnPhase1} />
            {isOnPhase1 && <Button disabled={!canMoveToPhase2} onClick={moveToPhase2}>move to phase 2</Button> }

            {taskData.data.phase == 2 && <ResultTable onSelect={(email)=>setSelected(email)}/> }
            {selected && <ResultDetails email={selected} />}
        </div>
    )
}
