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

    const filterEnable = (email) => {
        const newFilterData = { ...filterData }
        if (!newFilterData[email]) newFilterData[email] = { disable: false, uncount: false }
        newFilterData[email].disable = !newFilterData[email].disable
        setFilterData(newFilterData)
    }
    const filterCount = (email) => {
        const newFilterData = { ...filterData }
        if (!newFilterData[email]) newFilterData[email] = { disable: false, uncount: false }
        newFilterData[email].uncount = !newFilterData[email].uncount
        setFilterData(newFilterData)
    }

    const calcStats = () => {
        const newStats = {}
        Object.keys(taskData.data.answers).forEach(email => newStats[email] = {
            games: [], points: 0, judged: 0, enabled: true, count: true
        })
        Object.keys(filterData).forEach(email => {
            newStats[email].enabled = !filterData[email].disable
            newStats[email].count = !filterData[email].uncount
        })

        for (let i = 0; i < taskData.data.games.length; i++) {
            const game = taskData.data.games[i]
            const player1 = game.participant1
            const player2 = game.participant2
            newStats[game.judge].judged++
            if (!newStats[game.participant1].enabled || !newStats[player2].enabled) continue
            if (!newStats[game.judge].count) continue

            const game1 = { opponent: player2 }
            const game2 = { opponent: player1 }
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