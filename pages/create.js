import { useEffect, useState } from "react"
import { getDocRef, newDoc, readDoc } from "../utils/firebaseConfig"
import { updateDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import { TextField, Button } from '@mui/material';



export default function Create() {
    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const user = useRecoilValue(userDataAtom)
    const [doc, setDoc] = useState(null)
    const router = useRouter()

    useEffect(() => {
        if (router.query.id) {
            setDoc(router.query.id)
            readDoc('tasks', router.query.id).then(dd => {
                setText(dd.text)
                setTitle(dd.title)
            })
        }
    }, [router.query.id])

    const save = async () => {
        if (doc) {
            await updateDoc(getDocRef('tasks', doc), { text, title })
        } else {
            const docRef = await newDoc('tasks', {
                author: user.email,
                title, text, phase: 1, answers: {}
            });
            setDoc(docRef.id)
            router.push(`/task?id=${docRef.id}`)
        }
    }

    return (
        <div>
            <h1>Create & Edit</h1>
            <div id="create_container">
                <TextField fullWidth placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <TextField fullWidth placeholder="Text" value={text} onChange={(e) => setText(e.target.value)} />
                <Button onClick={save}>save</Button>

                <style jsx>{`
                #create_container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
            `}</style>
            </div>
        </div>
    )
}