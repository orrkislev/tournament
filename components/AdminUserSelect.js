import { updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { userDataAtom } from "../utils/atoms"
import { auth, getDocRef, readDoc } from "../utils/firebaseConfig"
import { Button, Fab, Drawer } from "@mui/material"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuthState } from "react-firebase-hooks/auth"

const adminEmails = [
    'orrkislev@gmail.com', 'freddy2000@gmail.com'
]

export default function AdminUserSelect() {
    const [user, loading, error] = useAuthState(auth);
    const [adminUsers, setAdminUsers] = useState([])
    const [userData, setUserData] = useRecoilState(userDataAtom)
    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
        if (!adminEmails.includes(user.email)) return
        if (!('origEmail' in userData)) setUserData({ ...userData, origEmail: user.email })
        readDoc('other', 'adminUsers').then(dd => {
            setAdminUsers(dd.users)
        })
    }, [])

    const addUser = () => {
        const newUsers = [...adminUsers, 'user' + (adminUsers.length + 1)]
        setAdminUsers(newUsers)
        updateDoc(getDocRef('other', 'adminUsers'), { users: newUsers })
    }

    const selectUser = (user) => {
        const newUserData = { ...userData, email: user }
        setUserData(newUserData)
    }

    if (!adminEmails.includes(user.email)) return null

    return (
        <>
            <Fab color="primary" aria-label="add" style={{ position: 'absolute', bottom: '3em', right: '3em' }} onClick={() => setDrawerOpen(true)}>
                <AdminPanelSettingsIcon />
            </Fab>
            <Drawer anchor={'left'} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div style={{ padding: '1em', display: 'flex', flexDirection: 'column' }}>
                    {userData.origEmail && <Button onClick={() => selectUser(userData.origEmail)}>{userData.displayName.split(' ')[0]}</Button>}
                    {adminUsers.map((user, i) => {
                        return <Button key={i} onClick={() => selectUser(user)}>{user}</Button>
                    })}
                    <Button variant="outlined" onClick={addUser}>Add User</Button>
                </div>
            </Drawer>
        </>
    )
}