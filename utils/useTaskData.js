import { deleteDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { taskDataAtom, userDataAtom } from "./atoms";
import { getDocRef } from "./firebaseConfig";

export default function useTaskData() {
    const [data, setData] = useRecoilState(taskDataAtom);
    const user = useRecoilValue(userDataAtom)

    function reset(){
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

    function startJudge(pair) {
        const newGames = [...data.games, { participant1: pair[0], participant2: pair[1], judge: user.uid }]
        update({ games: newGames })
    }
    async function updateJudge(pair, id) {
        const newGames = data.games.filter(g => (
            !(g.participant1 == pair[0] && g.participant2 == pair[1]) &&
            !(g.participant1 == pair[1] && g.participant2 == pair[0])))
        newGames.push({ participant1: pair[0], participant2: pair[1], judge: user.uid, winner: id })
        await update({ games: newGames })
    }

    async function remove(){
        const docRef = getDocRef('tasks', data.id)
        await deleteDoc(docRef)
    }


    return {
        data, setData, reset, load, update, remove,
        userOwnsTask, userAnsweredTask, saveAnswer, saveComment,
        startJudge, updateJudge, 
    }

}