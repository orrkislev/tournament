import { useEffect } from "react"
import { useRouter } from "next/router"
import useTaskData from "../utils/useTaskData"
import Manage from "./Manage"
import Answer from "./answer"
import Judge from "./Judge"

export default function TaskPage() {
    const router = useRouter()
    const taskData = useTaskData()

    useEffect(()=>{
        if (router.query.id) taskData.load(router.query.id)
    }, [router.query.id, taskData])


    if (!taskData.data) return <div>Loading...</div>

    return (
        <>
            { taskData.userOwnsTask()     && <Manage /> }
            { !taskData.userOwnsTask()    && taskData.data.phase == 1 && <Answer /> }
            { taskData.userAnsweredTask() && taskData.data.phase == 2 && <Judge /> }
        </>
    )
}