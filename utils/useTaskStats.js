import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import useTaskData from "./useTaskData";

const statsAtom = atom({ key: 'stats', default: null });

export default function useTaskStats() {
    const [stats, setStats] = useRecoilState(statsAtom);
    const taskData = useTaskData()
    const [filterData, setFilterData] = useState({})

    useEffect(() => {
        calcStats()
    }, [taskData.data, filterData])

    const filterEnable = (uid) => {
        const newFilterData = { ...filterData }
        if (!newFilterData[uid]) newFilterData[uid] = { disable: false, uncount: false }
        newFilterData[uid].disable = !newFilterData[uid].disable
        setFilterData(newFilterData)
    }
    const filterCount = (uid) => {
        const newFilterData = { ...filterData }
        if (!newFilterData[uid]) newFilterData[uid] = { disable: false, uncount: false }
        newFilterData[uid].uncount = !newFilterData[uid].uncount
        setFilterData(newFilterData)
    }

    const calcStats = () => {
        if (!taskData.data) return
        if (!taskData.data.games) return

        const newStats = {}
        Object.keys(taskData.data.answers).forEach(uid => newStats[uid] = {
            games: [], points: 0, judged: 0, enabled: true, count: true, uid, email: taskData.data.answers[uid].email,
            commented: taskData.data.answers[uid].leftComments ?? 0
        })
        Object.keys(filterData).forEach(uid => {
            newStats[uid].enabled = !filterData[uid].disable
            newStats[uid].count = !filterData[uid].uncount
        })

        for (let i = 0; i < taskData.data.games.length; i++) {
            const game = taskData.data.games[i]
            const player1 = game.participant1
            const player2 = game.participant2
            newStats[game.judge].judged++
            if (!newStats[game.participant1].enabled || !newStats[player2].enabled) continue
            if (!newStats[game.judge].count) continue

            const game1 = { opponent: player2, judge: game.judge }
            const game2 = { opponent: player1, judge: game.judge }
            if (game.winner == 1) {
                game1.result = "won"
                game2.result = "lost"
                newStats[player1].points+=3
            } else if (game.winner == 2) {
                game1.result = "lost"
                game2.result = "won"
                newStats[player2].points+=3
            } else {
                game1.result = "draw"
                game2.result = "draw"
                newStats[player1].points++
                newStats[player2].points++
            }
            newStats[player1].games.push(game1)
            newStats[player2].games.push(game2)
        }
        setStats(newStats)
    }

    return {
        stats, calcStats, filterEnable, filterCount
    };
}