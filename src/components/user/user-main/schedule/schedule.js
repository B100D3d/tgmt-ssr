import React, { useEffect, useContext, useState } from "react";
import ReactDataGrid from "react-data-grid";
import axios from 'axios';
import { useParams } from 'react-router-dom';

import './schedule.sass';

import { UserMenuOpenContext, UserContext } from '../../../../context';
import useWindowSize from '../../../../hooks/useWindowSize.hook'


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

const getSchedule = async (group, subgroup, even) => {
    const res = await axios.post('https://тгмт.рф/api/getSchedule', {
        query: `{
            getSchedule(groupID: '${ group }',
                        subgroup: '${ subgroup }',
                        even: '${ even }') {
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

    const [rows, setRows] = useState(DEFAULT_ROWS);
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [schedule, setSchedule] = useState(user.schedule);
    const windowSize = useWindowSize();

    const isAdmin = user.role === 'Admin'
    
    useEffect(() => {
        schedule 
            ? setRows(getRows(user.schedule)) 
            : getSchedule(params.group, 1, true).then((s) => {
                setSchedule(s)
            })
    }, [schedule])

    useEffect(() => {
        if (isOpen) {
            const k = windowSize.width < 800 ? 0.95 : 0.7
            setWidth(windowSize.width * k)
        } else {
            setWidth(windowSize.width * 0.95)
        }
        setHeight(document.querySelector('.schedule').clientHeight)
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
            <div className="schedule">
                <ReactDataGrid
                    columns={ columns }
                    rowGetter={ i => rows[i] }
                    rowsCount={ rows.length }
                    minWidth={ width }
                    //rowHeight={ 50 }
                    minHeight={ height }
                    enableCellSelect={ true }
                />
            </div>
        </div>
    )
}

export default Schedule;

