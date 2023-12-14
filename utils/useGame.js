import { useRecoilState, useRecoilValue, atom } from "recoil"
import useTaskData from "./useTaskData";
import useResponsive from "./useResponsive";
import { useEffect, useState } from "react";
import { userDataAtom } from "./atoms";

export const gameAtom = atom({ key: 'gameData', default: null });

export default function useGame() {
    const responsive = useResponsive()
    const user = useRecoilValue(userDataAtom)
    const [data, setData] = useRecoilState(gameAtom)
    const taskData = useTaskData()

    const [message, setMessage] = useState(null)
    const [isDisplay, setIsDisplay] = useState(false)
    const [judge, setJudge] = useState(null)

    useEffect(() => {
        console.log('new data', data)
        if (!data) return
        if (data.first.id && data.second.id && !data.first.text && !data.second.text) {
            const newData = structuredClone(data)
            newData.first.text = taskData.data.answers[data.first.id].text
            newData.second.text = taskData.data.answers[data.second.id].text
            setData(newData)
        }
    }, [data])

    async function submitWinner(val) {
        const newGames = taskData.data.games.filter(g => (
            !(g.participant1 == data.first.id && g.participant2 == data.second.id) &&
            !(g.participant1 == data.second.id && g.participant2 == data.first.id)))

        if (!val) {
            val = 0
            if (data.first.state == 'won') val = 1
            else if (data.second.state == 'won') val = 2
        }
        newGames.push({ participant1: data.first.id, participant2: data.second.id, judge: user.uid, winner: val })
        const newData = structuredClone(data)
        newData.active = false
        setData(newData)
        await taskData.update({ games: newGames })
    }

    function getGame() {
        const myJudgedGames = taskData.data.games.filter(g => g.judge == user.uid)
        const answerCount = Object.keys(taskData.data.answers).length
        const maxGames = (answerCount - 1) / 2
        if (myJudgedGames.filter(g => 'winner' in g).length >= maxGames * 1.2) {
            setMessage('אין עוד משחקים לדירוג')
            return
        }

        const myUnjudgedGames = myJudgedGames.filter(g => !('winner' in g))
        if (myUnjudgedGames.length > 0) {
            setData({
                first: { id: myUnjudgedGames[0].participant1 },
                second: { id: myUnjudgedGames[0].participant2 },
            })
            return
        }


        const allPairings = []
        const students = Object.keys(taskData.data.answers).filter(uid => uid !== user.uid)
        for (let i = 0; i < students.length; i++) {
            for (let j = i + 1; j < students.length; j++) {
                if (taskData.data.games.find(game => game.participant1 == students[i] && game.participant2 == students[j])) continue
                if (taskData.data.games.find(game => game.participant1 == students[j] && game.participant2 == students[i])) continue
                allPairings.push([students[i], students[j]])
            }
        }
        if (allPairings.length > 0) {
            const seenPlayers = new Set()
            myJudgedGames.forEach(g => {
                seenPlayers.add(g.participant1)
                seenPlayers.add(g.participant2)
            })
            allPairings.sort((a, b) => {
                const aSeen = seenPlayers.has(a[0]) + seenPlayers.has(a[1])
                const bSeen = seenPlayers.has(b[0]) + seenPlayers.has(b[1])
                if (aSeen == bSeen) return Math.random() - 0.5
                return aSeen - bSeen
            })
            const selectedPair = allPairings[0]

            const newGames = [...taskData.data.games, { participant1: selectedPair[0], participant2: selectedPair[1], judge: user.uid }]
            taskData.update({ games: newGames })

            setData({ first: { id: selectedPair[0] }, second: { id: selectedPair[1] } })
            // setActive(true)
        } else {
            setMessage('אין עוד משחקים לדירוג')
        }
    }

    function setGame(game) {
        let newData = null

        let newGameData = taskData.data.games.find(g => g.participant1 == game.id1 && g.participant2 == game.id2)
        if (!newGameData) newGameData = taskData.data.games.find(g => g.participant1 == game.id2 && g.participant2 == game.id1)

        if (newGameData && newGameData.winner != null) {
            newData = { first: { id: newGameData.participant1, state: 'lost' }, second: { id: newGameData.participant2, state: 'lost' }, tie: 'lost' }
            if (newGameData.winner == 0) newData.tie = 'won'
            if (newGameData.winner == 1 || newGameData.winner == newGameData.participant1) newData.first.state = 'won'
            if (newGameData.winner == 2 || newGameData.winner == newGameData.participant2) newData.second.state = 'won'
            newData.active = false
            setData(newData)
            setMessage(null)
            setIsDisplay(true)
            setJudge(newGameData.judge)
        }

        setData(newData)
    }

    function select(val) {
        if (data.active == false) return

        const newData = structuredClone(data)
        delete newData.first.state
        delete newData.second.state
        delete newData.tie

        if (responsive.isDesktop) {
            submitWinner(val)
            newData.first.state = 'lost'
            newData.second.state = 'lost'
            newData.tie = 'lost'
        }
        if (val == data.first.id) newData.first.state = 'won'
        if (val == data.second.id) newData.second.state = 'won'
        if (val == 'tie') newData.tie = 'won'
        setData(newData)
    }

    function readyToSubmit() {
        if (data.active && (data.first.state || data.second.state || data.tie)) return true
        return false
    }

    function isDone() {
        if (responsive.isDesktop) return true
        if (data.active == false && (data.first.state || data.second.state || data.tie)) return true
        return false
    }

    return {
        data, message, isDisplay, judge,
        getGame, select, submitWinner, setGame, readyToSubmit, isDone
    }
}