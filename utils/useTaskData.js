import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { userDataAtom } from "./atoms";
import { getDocRef } from "./firebaseConfig";

export const taskDataAtom = atom({ key: 'taskData', default: null });
export default function useTaskData() {
    const [data, setData] = useRecoilState(taskDataAtom);
    const user = useRecoilValue(userDataAtom)

    function reset() {
        setData(null)
    }

    function load(id) {
        onSnapshot(getDocRef('tasks', id), (doc) => {
            if (doc.exists()) {
                const newData = { ...doc.data(), id: doc.id }
                setData(newData)
            } else {
                setData(null)
            }
        })
    }
    async function update(updateData) {
        const docRef = getDocRef('tasks', data.id)
        updateData.lastUpdate = new Date()
        await updateDoc(docRef, updateData)
    }

    const userOwnsTask = () => data.author === user.uid
    const userAnsweredTask = () => Object.keys(data.answers).includes(user.uid)

    function saveAnswer(text) {
        const newAnswer = { text, comments: [], email: user.name, }
        const newAnswers = { ...data.answers, [user.uid]: newAnswer }
        update({ answers: newAnswers })
    }
    function saveComment(uid, txt) {
        const newComments = [...data.answers[uid].comments, txt]
        const newAnswer = { ...data.answers[uid], comments: newComments }
        const newAnswers = { ...data.answers, [uid]: newAnswer }
        if (!('leftComments' in newAnswers[user.uid])) newAnswers[user.uid] = { ...newAnswers[user.uid], leftComments: 0 }
        newAnswers[user.uid] = { ...newAnswers[user.uid], leftComments: newAnswers[user.uid].leftComments + 1 }
        update({ answers: newAnswers })
    }

    async function remove() {
        const docRef = getDocRef('tasks', data.id)
        await deleteDoc(docRef)
    }

    function getLeagueProgress() {
        const sumAnswers = Object.values(data.answers).length
        const totalGames = .5 * sumAnswers * (sumAnswers - 1)
        const sumGames = data.games.length
        const perc = Math.round(sumGames / totalGames * 100)
        return perc
    }



    return {
        data, setData, reset, load, update, remove,
        userOwnsTask, userAnsweredTask, saveAnswer, saveComment,
        getLeagueProgress,
    }

}