import { Paper, TableContainer, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, Switch } from '@mui/material';
import GiteIcon from '@mui/icons-material/Gite';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useEffect, useState } from 'react';
import useTaskStats from '../utils/useTaskStats';
import Section from './Section';
import { useRecoilValue } from 'recoil';
import { userDataAtom } from '../utils/atoms';
import styled from 'styled-components';
import useTaskData from '../utils/useTaskData';

const HoverAnswer = styled.div`
    display: flex;
    position: absolute;
    top: ${props => props.top}px;
    left: 35vw;
    width: 30vw;
    padding: 1em;
    background-color: #ffffff;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 0 10px #000000aa;
    `;

export default function ResultTable(props) {
    const taskStats = useTaskStats()
    const taskData = useTaskData()
    const user = useRecoilValue(userDataAtom)
    const [selected, setSelected] = useState(null)
    const [hover, setHover] = useState(null)
    const [showActions, setShowActions] = useState(props.hideActions ? false : true)

    useEffect(() => {
        if (props.markUser) setSelected(user.uid)
    }, [props])

    const select = (uid) => {
        if (props.disableSelect) return
        if (selected == uid) uid = null
        setSelected(uid)
        props.onSelect(uid)
    }

    if (!taskStats.stats) {
        taskStats.calcStats()
        return <div>Loading...</div>
    }

    const table = [...Object.values(taskStats.stats).map(a => { return { ...a } })]
    table.sort((a, b) => b.points - a.points)

    if (props.markUser)
        if (table.findIndex(e => e.uid === selected) > 5) setSelected(null)


    table.forEach((row, i) => {
        const clr = (i % 2 == 0 ? "#d0d0d0" : "#ffffff")
        row.color = `linear-gradient(30deg, ${clr}66 30%, ${clr}aa 90%)`
        if (props.withHover && hover && row.uid == hover[1]) row.color += 'black'
        row.showName = true
        if (props.hideNames){
            if (props.hideNames instanceof Number && i >= props.hideNames) row.showName = false
            if (props.hideNames === true) row.showName = false
        }
        if (selected && row.uid === selected) row.showName = true
    })

    if (selected) {
        const selectedData = table.find(e => e.uid === selected)
        selectedData.color = '#888'
        if (!props.markUser) {
            selectedData.games.forEach(game => {
                table.forEach(row => {
                    if (game.opponent === row.uid) {
                        if (game.result === 'won') row.color += ', linear-gradient(90deg, transparent 70%, #55ff55 100%)'
                        if (game.result === 'lost') row.color += ', linear-gradient(90deg, transparent 70%, #ff5555 100%)'
                        if (game.result === 'draw') row.color += ', linear-gradient(90deg, transparent 70%, #5555ff 100%)'
                    }
                })
            })
        }
    }

    const tableElement = (
        <>
            <TableContainer component={Paper}>
                
                {!props.hideActions && (
                    <div style={{display:'flex',justifyContent:'end', fontSize:'0.7em', alignItems:'center', color:'gray'}}>
                        Advanced
                        <Switch defaultChecked size="small" checked={showActions} onChange={(e) => setShowActions(e.target.checked)} />
                    </div>
                )}

                <Table size="small" style={{cursor:'pointer'}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>place</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell align="right">judged</TableCell>
                            <TableCell align="right">commented</TableCell>
                            <TableCell align="right">won</TableCell>
                            <TableCell align="right">lost</TableCell>
                            <TableCell align="right">draw</TableCell>
                            <TableCell align="right">games</TableCell>
                            <TableCell align="right">points</TableCell>
                            {showActions && <TableCell align="right">enable</TableCell>}
                            {showActions && <TableCell align="right">count judge</TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {table.map((row, i) => (
                            <TableRow key={row.uid} style={{ background: row.color }} onClick={() => select(row.uid)} >
                                <TableCell component="th" scope="row"> {i + 1} </TableCell>
                                <TableCell onMouseEnter={(e) => setHover([e.pageY, row.uid])} onMouseLeave={() => setHover(null)}> {props.hideNames ? (selected == row.uid ? row.email : '****') : row.email} </TableCell>
                                <TableCell align="center">{row.judged}</TableCell>
                                <TableCell align="center">{row.commented}</TableCell>
                                <TableCell align="center">{row.games.filter(game => game.result == 'won').length}</TableCell>
                                <TableCell align="center">{row.games.filter(game => game.result == 'lost').length}</TableCell>
                                <TableCell align="center">{row.games.filter(game => game.result == 'draw').length}</TableCell>
                                <TableCell align="center">{row.games.length}</TableCell>
                                <TableCell align="center">{row.points}</TableCell>
                                {showActions && <TableCell align="center"><GiteIcon color={row.enabled ? 'nonw' : 'warning'} onClick={() => taskStats.filterEnable(row.uid)} /></TableCell>}
                                {showActions && <TableCell align="center"><BeachAccessIcon color={row.count ? 'nonw' : 'warning'} onClick={() => taskStats.filterCount(row.uid)} /></TableCell>}
                            </TableRow>
                        ))}
                        {props.withHover && hover && <HoverAnswer top={hover[0]}>{taskData.data.answers[hover[1]].text}</HoverAnswer>}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
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