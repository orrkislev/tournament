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
            opponents: {},
            judged: 0, won: 0, lost: 0, tie: 0, total: 0, score: 0,
            enabled: true, count: true, uid, email: taskData.data.answers[uid].email,
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

            newStats[player1].opponents[player2] = { result: game.winner == 1 ? 'won' : game.winner == 2 ? 'lost' : 'tie', judge: game.judge }
            newStats[player2].opponents[player1] = { result: game.winner == 1 ? 'lost' : game.winner == 2 ? 'won' : 'tie', judge: game.judge }
        }

        Object.keys(newStats).forEach(uid => {
            const player = newStats[uid]
            Object.keys(player.opponents).forEach(opponent => {
                const result = player.opponents[opponent].result
                player[result]++
                player.total++
                if (result == 'won') player.score += 3
                if (result == 'tie') player.score += 1
            })
        })
        setStats(newStats)
    }

    return {
        stats, calcStats, filterEnable, filterCount
    };
}