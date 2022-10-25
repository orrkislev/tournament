import { onSnapshot, updateDoc } from "firebase/firestore";
import { useRecoilState, useRecoilValue } from "recoil";
import { taskDataAtom, userDataAtom } from "./atoms";
import { getDocRef } from "./firebaseConfig";

export default function useTaskData() {
    const [data, setData] = useRecoilState(taskDataAtom);
    const user = useRecoilValue(userDataAtom)

    function load(id) {
        onSnapshot(getDocRef('tasks', id), (doc) => {
            const newData = { ...doc.data(), id: doc.id }
            setData(newData)
        })
    }
    async function update(updateData) {
        const docRef = getDocRef('tasks', data.id)
        await updateDoc(docRef, updateData)
    }

    const userOwnsTask = () => data.author === user.email
    const userAnsweredTask = () => Object.keys(data.answers).includes(user.email)

    function saveAnswer(text) {
        const newAnswer = { text, comments: [] }
        const newAnswers = { ...data.answers, [user.email]: newAnswer }
        update({ answers: newAnswers })
    }
    function saveComment(email, txt) {
        const newComments = [...data.answers[email].comments, txt]
        const newAnswer = { ...data.answers[email], comments: newComments }
        const newAnswers = { ...data.answers, [email]: newAnswer }
        update({ answers: newAnswers })
    }

    function startJudge(pair) {
        const newGames = [...data.games, { participant1: pair[0], participant2: pair[1], judge: user.email }]
        update({ games: newGames })
    }
    async function updateJudge(pair, id) {
        const newGames = data.games.filter(g => g.participant1 !== pair[0] || g.participant2 !== pair[1])
        newGames.push({ participant1: pair[0], participant2: pair[1], judge: user.email, winner: id })
        await update({ games: newGames })
    }


    return {
        data, load, update,
        userOwnsTask, userAnsweredTask, saveAnswer, saveComment,
        startJudge, updateJudge
    }

}