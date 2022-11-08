import { updateDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { userDataAtom } from "../utils/atoms"
import { auth, getDocRef, readDoc } from "../utils/firebaseConfig"
import { Button, Fab, Drawer } from "@mui/material"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAuthState } from "react-firebase-hooks/auth"

export default function AdminUserSelect() {
    const [user, loading, error] = useAuthState(auth);
    const [adminUsers, setAdminUsers] = useState([])
    const [userData, setUserData] = useRecoilState(userDataAtom)
    const [drawerOpen, setDrawerOpen] = useState(false)

    useEffect(() => {
        readDoc('other', 'adminUsers').then(dd => {
            if (dd.withFake.includes(user.email)) {
                setAdminUsers(dd.users)
                setUserData({ ...userData, origEmail: user.email, email: user.email })
            }
            if (dd.emails.includes(user.email)) {
                setUserData({ ...userData, admin: true })
            }
        })
    }, [user])

    // useEffect(() => {
    //     if (!adminEmails.includes(user.email)) return
    //     const newUserData = { ...userData }
    //     newUserData.isAdmin = true
    //     if (!('origEmail' in userData)) {
    //         newUserData.origEmail = user.email
    //         newUserData.email = user.email
    //     }
    //     setUserData(newUserData)
    //     readDoc('other', 'adminUsers').then(dd => {
    //         setAdminUsers(dd.users)
    //     })
    // }, [user])

    const addUser = () => {
        const newUsers = [...adminUsers, 'user' + (adminUsers.length + 1)]
        setAdminUsers(newUsers)
        updateDoc(getDocRef('other', 'adminUsers'), { users: newUsers })
    }

    const selectUser = (user) => {
        const newUserData = { ...userData, email: user }
        setUserData(newUserData)
    }

    if (!adminUsers.length) return null

    return (
        <>
            <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '3em', left: '3em' }} onClick={() => setDrawerOpen(true)}>
                <AdminPanelSettingsIcon />
            </Fab>
            <Drawer anchor={'left'} open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div style={{ padding: '1em', display: 'flex', flexDirection: 'column' }}>
                    {userData.origEmail && <Button onClick={() => selectUser(userData.origEmail)}>{user.displayName.split(' ')[0]}</Button>}
                    {adminUsers.map((user, i) => {
                        return <Button key={i} onClick={() => selectUser(user)}>{user}</Button>
                    })}
                    <Button onClick={() => selectUser('freddy2000@gmail.com')}>Shachar</Button>
                    <Button onClick={() => selectUser('yonirp@gmail.com')}>Yoni</Button>
                    <Button variant="outlined" onClick={addUser}>Add User</Button>
                </div>
            </Drawer>
        </>
    )
}