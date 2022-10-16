import { Container, AppBar, Typography, Toolbar, IconButton } from "@mui/material"
import { useRecoilValue } from "recoil"
import { userDataAtom } from "../utils/atoms"
import { getUser, signOut } from "../utils/firebaseConfig"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export default function Main(props) {
    const user = useRecoilValue(userDataAtom)

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="dense">
                    <Typography  sx={{ flexGrow: 1 }}>
                        Hi, {user.email}
                    </Typography>
                        <div>
                            <IconButton onClick={signOut}>
                                <AccountCircleIcon />
                            </IconButton>
                        </div>
                </Toolbar>
            </AppBar>
            {props.children}
        </>
    )
}