import React, { useEffect, useContext, useState, useRef } from "react";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import loadable from "@loadable/component"

import './schedule.sass';

import { UserMenuOpenContext, UserContext } from '/context';
import useWindowSize from '/hooks/useWindowSize.hook'
import Switch from "./switch/switch";
const ReactDataGrid = loadable(() => import("react-data-grid"))


const DEFAULT_SCHEDULE_ITEM = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: ""
}
const DEFAULT_ROWS = [
    { classNumber: 1, ...DEFAULT_SCHEDULE_ITEM },
    { classNumber: 2, ...DEFAULT_SCHEDULE_ITEM },
    { classNumber: 3, ...DEFAULT_SCHEDULE_ITEM },
    { classNumber: 4, ...DEFAULT_SCHEDULE_ITEM },
    { classNumber: 5, ...DEFAULT_SCHEDULE_ITEM },
    { classNumber: 6, ...DEFAULT_SCHEDULE_ITEM },
    { classNumber: 7, ...DEFAULT_SCHEDULE_ITEM }
]

const getRows = (schedule) => {
    return schedule.reduce((acc, curr) => {
        if (!acc.length) {
            acc.push(...DEFAULT_ROWS)
        }

        const scheduleItem = acc.find(({ classNumber }) => classNumber === curr.classNumber)
        scheduleItem[curr.weekday] = `${curr.subject.name} (${curr.subject.teacher})`

        return acc
    }, [])
}

const getSchedule = async (group, { subgroup, even }) => {

    const res = await axios.post('https://тгмт.рф/api/getSchedule', {
        query: `{
            getSchedule(groupID: "${ group }",
                        subgroup: ${ subgroup },
                        even: ${ even }) {
                            classNumber
                            weekday
                            subject {
                                id
                                name
                                teacher
                            }
                        }
        }`
    }, { withCredentials: true }) 

    return res.data.data.getSchedule;
}


const Schedule = () => {

    const params = useParams();

    const [isOpen] = useContext(UserMenuOpenContext);
    const { user } = useContext(UserContext);

    const isAdmin = user.role === 'Admin'
    const group = user.group?.id || params.group;

    const [rows, setRows] = useState(DEFAULT_ROWS);
    const [width, setWidth] = useState();
    const [switchState, setSwitch] = useState({});
    const [schedule, setSchedule] = useState(user.schedule);
    const timestamp = useRef();

    const windowSize = useWindowSize();

    const handleSchedule = async () => {
        timestamp.current = new Date().getTime();
        const localTimestamp = timestamp.current;
        await new Promise(r => setTimeout(r, 500));
        if (localTimestamp === timestamp.current) {
            try {
                const s = await getSchedule(group, switchState);
                setSchedule(s)
            } catch(err) {}
        }
    }
    
    useEffect(() => {
        schedule && setRows(getRows(schedule))
    }, [schedule])

    useEffect(() => {
        if(Object.keys(switchState).length) {
            handleSchedule()
        } else if(!user.schedule) {
            getSchedule(group, { even: true, subgroup: 1 }).then((s) => {
                setSchedule(s)
            })
        }
    }, [switchState])

    useEffect(() => {
        if (isOpen) {
            const menuWidth = windowSize.width > 800 ? document.querySelector('.user-menu').clientWidth : 0
            setWidth(windowSize.width * 0.95 - menuWidth)
        } else {
            setWidth(windowSize.width * 0.95)
        }
    }, [isOpen, windowSize])

    useEffect(() => {
        new Promise(r => setTimeout(r, 500)).then(() => {
            document.querySelector('.react-grid-Container').classList.add('anim')
        })
    }, [])


    const columns = [
        { key: 'classNumber', name: '№ пары', resizable: true, width: 80 },
        { key: '1', name: 'Понедельник', editable: isAdmin, resizable: true },
        { key: '2', name: 'Вторник', editable: isAdmin, resizable: true },
        { key: '3', name: 'Среда', editable: isAdmin, resizable: true },
        { key: '4', name: 'Четверг', editable: isAdmin, resizable: true },
        { key: '5', name: 'Пятиница', editable: isAdmin, resizable: true },
        { key: '6', name: 'Суббота', editable: isAdmin, resizable: true }
    ];


    return (
        <div className='schedule-container'>
            <h1>Расписание</h1>
            <div className='buttons-container'>
                <div className='switch-container'>
                    <Switch val0='Чет' val1='Неч' title='Неделя' isAdmin={ isAdmin }
                         state={ [switchState, setSwitch] } />
                    <Switch val0='&nbsp;&nbsp;1' val1='&nbsp;&nbsp;2' title='Подгруппа' isAdmin={ isAdmin }
                         state={ [switchState, setSwitch] } />
                </div>
            </div>
            <div className="schedule">
                <ReactDataGrid
                    columns={ columns }
                    rowGetter={ i => rows[i] }
                    rowsCount={ rows.length }
                    minWidth={ width }
                    enableCellSelect={ true }
                />
            </div>
        </div>
    )
}

export default Schedule;

