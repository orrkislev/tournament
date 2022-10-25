import { useEffect } from "react"
import { useRouter } from "next/router"
import useTaskData from "../utils/useTaskData"
import Manage from "./Manage"
import Answer from "./answer"
import Judge from "./Judge"
import Task from "../components/Task"

export default function TaskPage() {
    const router = useRouter()
    const taskData = useTaskData()

    useEffect(() => {
        if (router.query.id) taskData.load(router.query.id)
    }, [router.query.id])


    if (!taskData.data) return <div>Loading...</div>

    return (
        <>
            <Task />

            {taskData.userOwnsTask() ? (
                <Manage />
            ) : (
                <>
                    {taskData.data.phase == 2 && <Judge />}
                    <Answer />
                </>
            )}
        </>
    )
}