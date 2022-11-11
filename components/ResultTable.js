import { Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import GiteIcon from '@mui/icons-material/Gite';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useEffect, useState } from 'react';
import useTaskData from '../utils/useTaskData';
import useTaskStats from '../utils/useTaskStats';
import Section from './Section';
import { useRecoilValue } from 'recoil';
import { userDataAtom } from '../utils/atoms';


export default function ResultTable(props) {
    const taskStats = useTaskStats()
    const user = useRecoilValue(userDataAtom)
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        if (props.markUser) setSelected(user.uid)
    }, [props])

    const select = (uid) => {
        if (props.disableSelect) return
        setSelected(uid)
        props.onSelect(uid)
    }

    if (!taskStats.stats) {
        taskStats.calcStats()
        return <div>Loading...</div>
    }

    const table = Object.values(taskStats.stats)
    table.sort((a, b) => b.points - a.points)

    if (props.markUser)
        if (table.findIndex(e => e.uid === selected) > 5) setSelected(null)

    const tableElement = (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>place</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">judged</TableCell>
                        <TableCell align="right">commented</TableCell>
                        <TableCell align="right">games</TableCell>
                        <TableCell align="right">won</TableCell>
                        <TableCell align="right">lost</TableCell>
                        <TableCell align="right">draw</TableCell>
                        <TableCell align="right">points</TableCell>
                        {!props.hideActions && <TableCell align="right">enable</TableCell>}
                        {!props.hideActions && <TableCell align="right">count judge</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {table.map((row, i) => (
                        <TableRow key={row.uid}
                            style={{ backgroundColor: selected == row.uid ? "#b0b0b0" : (i % 2 == 0 ? "#f0f0f0" : "#ffffff") }}
                            onClick={() => select(row.uid)}>
                            <TableCell component="th" scope="row"> {i + 1} </TableCell>
                            <TableCell> {props.hideNames ? (selected == row.uid ? row.email : '****') : row.email} </TableCell>
                            <TableCell align="center">{row.judged}</TableCell>
                            <TableCell align="center">{row.commented}</TableCell>
                            <TableCell align="center">{row.games.length}</TableCell>
                            <TableCell align="center">{row.games.filter(game => game.result == 'won').length}</TableCell>
                            <TableCell align="center">{row.games.filter(game => game.result == 'lost').length}</TableCell>
                            <TableCell align="center">{row.games.filter(game => game.result == 'draw').length}</TableCell>
                            <TableCell align="center">{row.points}</TableCell>
                            {!props.hideActions && <TableCell align="center"><GiteIcon color={row.enabled ? 'nonw' : 'warning'} onClick={() => taskStats.filterEnable(row.name)} /></TableCell>}
                            {!props.hideActions && <TableCell align="center"><BeachAccessIcon color={row.count ? 'nonw' : 'warning'} onClick={() => taskStats.filterCount(row.name)} /></TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )


    if (props.asSection) {
        return (
            <Section title='טבלה' info>
                {tableElement}
            </Section>
        )
    }

    return tableElement
}