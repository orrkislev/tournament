import useTaskData from "../utils/useTaskData"
import { Button, SectionSideTitle } from "../styles/Styles";
import ResultTable from "../components/ResultTable";
import Task from "../components/Task";
import { useState } from "react";
import ResultDetails from "../components/ResultDetails";
import Section from "../components/Section";

export default function Manage() {
    const taskData = useTaskData()


    let phaseComp
    if (taskData.data.phase == 1) phaseComp = <ManagePhase1 />
    if (taskData.data.phase == 2) phaseComp = <ManagePhase2 />

    const removeTask = async () => {
        await taskData.remove()
        window.location.href = "/"
    }

    return (
        <>
            {phaseComp}
            <Section info title='סכנה'>
                <Button onClick={removeTask}>מחק משימה</Button>
            </Section>
        </>
    )
}

function ManagePhase2() {
    const [selected, setSelected] = useState(null)

    return (
        <Section info>
            <ResultTable onSelect={(uid) => setSelected(uid)} withHover/>
            {selected && <ResultDetails uid={selected} />}
        </Section>
    )
}

function ManagePhase1() {
    const taskData = useTaskData()

    const numAnswers = Object.keys(taskData.data.answers).length
    const canMoveToPhase2 = taskData.data.phase == 1 && numAnswers > 2

    const moveToPhase2 = () => {
        if (canMoveToPhase2) taskData.update({ phase: 2, games: [] })
    }

    return (
        <>
            <Section info>
                {taskData.data.phase == 1 &&
                    <div>
                        {numAnswers == 0 ?
                            `אף אחד עדיין לא ענה על השאלון.`
                            : numAnswers == 1 ?
                                `ענה עד כה אחד על השאלה`
                                : `ענו עד כה ${numAnswers} על השאלה`
                        }
                    </div>
                }


                {Object.values(taskData.data.answers).map((val, i) => (
                    <div key={i}>
                        <div><strong>{val.email}</strong></div>
                        <div style={{ whiteSpace: 'pre-line' }}>{val.text}</div>
                    </div>)
                )}
            </Section>

            {taskData.data.phase == 1 && (
                <Section action>
                    <Button disabled={!canMoveToPhase2} onClick={moveToPhase2}>המשך לשלב השיפוט</Button>
                </Section>
            )}
        </>
    )
}
