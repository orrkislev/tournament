import { useEffect } from "react"
import { useRouter } from "next/router"
import useTaskData from "../utils/useTaskData"
import Manage from "./Manage"
import Answer from "./answer"
import Judge from "./Judge"
import Task from "../components/Task"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import ResultTable from "../components/ResultTable"

export default function TaskPage() {
    const router = useRouter()
    const taskData = useTaskData()
    const user = useRecoilValue(userDataAtom)

    useEffect(() => {
        if (router.query.id) taskData.load(router.query.id)
    }, [router.query.id])


    if (!taskData.data) return <div>Loading...</div>

    if (taskData.data.phase == 2 && !Object.keys(taskData.data.answers).includes(user.email)) {
        router.push('/')
        return null
    }

    return (
        <>
            <Task />

            {taskData.userOwnsTask() ? (
                <Manage />
            ) : (
                <>
                    {taskData.data.phase == 2 && <Judge />}
                    <Answer />
                    <ResultTable hideNames markUser asSection disableSelect hideActions/>
                </>
            )}
        </>
    )
}