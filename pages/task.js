import { useEffect } from "react"
import { useRouter } from "next/router"
import useTaskData from "../utils/useTaskData"
import Manage from "./Manage"
import Answer from "./answer"
import Judge from "./Judge"
import Task from "../components/Task"
import ResultTable from "../components/ResultTable"
import TaskProgress from "../components/TaskProgress"

export default function TaskPage() {
    const router = useRouter()
    const taskData = useTaskData()

    useEffect(() => {
        if (router.query.id) taskData.load(router.query.id)
    }, [router.query.id])

    if (!taskData.data) return <div>Loading...</div>

    let permit = false
    if (taskData.userOwnsTask()) permit = 'teacher'
    else if (taskData.userAnsweredTask()) permit = 'student'
    else if (taskData.data.phase == 1) permit = 'student'

    if (!permit) {
        router.push('/')
        return null
    }

    return (
        <>
            <Task />


            {permit == 'teacher' ? (
                <>
                    <TaskProgress />
                    <Manage />
                </>
            ) : (
                <>
                    {taskData.data.phase == 2 && taskData.getLeagueProgress()!=100 && <Judge />}
                    <Answer />
                    {taskData.data.phase != 1 && <ResultTable
                        hideNames
                        markUser
                        asSection
                        disableSelect
                        hideActions
                        withHover={taskData.getLeagueProgress() == 100} />}
                </>
            )}
        </>
    )
}