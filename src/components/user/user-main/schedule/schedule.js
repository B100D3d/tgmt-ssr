import React, { useEffect, useContext, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import loadable from "@loadable/component"

import "./schedule.sass"
import { getSchedule, getSubjects, sendSchedule } from "/api"

import { UserMenuOpenContext, UserContext } from "/context"
import useWindowSize from "/hooks/useWindowSize.hook"
import Switch from "./switch/switch";
const ReactDataGrid = loadable(() => import("react-data-grid"))
import SelectEditor from "./select-editor"
import cogoToast from "cogo-toast"

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

        const scheduleItem = acc.find(({ classNumber }) => classNumber === curr.classNumber)
        scheduleItem[curr.weekday] = `${curr.subject.name} (${curr.subject.teacher})`

        return acc
    }, DEFAULT_ROWS.map(r => ({...r})))
}

const Schedule = () => {

    const params = useParams()

    const [isOpen] = useContext(UserMenuOpenContext)
    const { user } = useContext(UserContext)

    const isAdmin = user.role === "Admin"
    const group = user.group?.id || params.group

    const [rows, setRows] = useState(DEFAULT_ROWS.map(r => ({...r})))
    const [changedCells, setChangedCells] = useState([])
    const [width, setWidth] = useState()
    const [switchState, setSwitch] = useState({})
    const [schedule, setSchedule] = useState(user.schedule)
    const switchTimeout = useRef()

    const windowSize = useWindowSize()

    const [subjectTypes, setSubjectTypes] = useState()

    const handleSchedule = () => {
        clearTimeout(switchTimeout.current)
        switchTimeout.current = setTimeout(() => {
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            const opts = { even: true, subgroup: 1, ...switchState }
            getSchedule(group, opts)
                .then((s) => {
                    hide()
                    cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                    setSchedule(s)
                    setChangedCells([])
                })
                .catch((error) => {
                    hide()
                    cogoToast.error("Ошибка сервера.", { position: "top-right" })
                })
        }, 500)
    }

    useEffect(() => {
        if (isAdmin) {
            getSubjects().then((subjects) => {
                setSubjectTypes(subjects.map((subject) => ({
                    id: subject.id,
                    value: `${ subject.name } (${ subject.teacher })`
                })))
            })
        }
    }, [isAdmin])

    useEffect(() => {
        schedule && setRows(getRows(schedule))
    }, [schedule])

    useEffect(() => {
        subjectTypes && setColumns(columns.map((c, i) => i === 0 ? c
            : ({ ...c, editor: <SelectEditor options={ subjectTypes }/> })))
    }, [subjectTypes])

    useEffect(() => {
        if(user.schedule && !Object.keys(switchState).length) return
        handleSchedule()
    }, [switchState])

    useEffect(() => {
        resize(isOpen, windowSize, setWidth)
    }, [isOpen, windowSize])

    useEffect(() => {
        new Promise(r => setTimeout(r, 500)).then(() => {
            document.querySelector(".react-grid-Container").classList.add("anim")
        })
    }, [])

    useEffect(() => setSaveBtnVisibility(changedCells.length), [changedCells])

    const [columns, setColumns] = useState([
        { key: "classNumber", name: "№ пары", resizable: true, width: 80 },
        { key: "1", name: "Понедельник", editable: isAdmin, resizable: true },
        { key: "2", name: "Вторник", editable: isAdmin, resizable: true },
        { key: "3", name: "Среда", editable: isAdmin, resizable: true },
        { key: "4", name: "Четверг", editable: isAdmin, resizable: true },
        { key: "5", name: "Пятиница", editable: isAdmin, resizable: true },
        { key: "6", name: "Суббота", editable: isAdmin, resizable: true }
    ])

    const onGridRowsUpdated = (data) => {
        if (Object.values(data.updated)[0] !== undefined) {
            const range = (size, start) => [...Array(size).keys()].map((key) => key + start)
            const weekday = +data.cellKey
            const { fromRow, toRow } = data
            const rowsCount = toRow - fromRow + 1
            const subject = subjectTypes.find((subject) => subject.value === data.updated[weekday])
            const newRows = [...rows]
            const newChangedCells = [...changedCells]

            range(rowsCount, fromRow).map((i) => {
                newRows[i] = { ...newRows[i], ...data.updated }
                newChangedCells.push(
                        { weekday, classNumber: i+1, subjectID: subject.id }
                    )
            })
            setRows(newRows)
            setChangedCells(newChangedCells)
        }
    }

    const handleSave = () => {
        document.querySelector(".save-button").disabled = true
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        const opts = { even: true, subgroup: 1, ...switchState }
        sendSchedule(group, opts, changedCells)
            .then((s) => {
                document.querySelector(".save-button").disabled = false
                hide()
                cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                setSchedule(s)
                setChangedCells([])
            })
            .catch(error => {
                document.querySelector(".save-button").disabled = false
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
            })
    }

    return (
        <div className="schedule-container">
            <h1>Расписание</h1>
            <div className="buttons-container">
                <div className="switch-container">
                    <Switch val0="Чет" val1="Неч" title="Неделя" isAdmin={ isAdmin }
                         state={ [switchState, setSwitch] } />
                    <Switch val0="&nbsp;&nbsp;1" val1="&nbsp;&nbsp;2" title="Подгруппа" isAdmin={ isAdmin }
                         state={ [switchState, setSwitch] } />
                </div>
                <button className="save-button" onClick={ handleSave }>Сохранить</button>
            </div>
            <div className="schedule">
                <ReactDataGrid
                    columns={ columns }
                    rowGetter={ i => rows[i] }
                    rowsCount={ rows.length }
                    minWidth={ width }
                    enableCellSelect={ true }
                    onGridRowsUpdated={ onGridRowsUpdated }
                />
            </div>
        </div>
    )
}

const resize = (isOpen, windowSize, setWidth) => {
    if (isOpen) {
        const menuWidth = windowSize.width > 800 ? document.querySelector(".user-menu").clientWidth : 0
        setWidth(windowSize.width * 0.95 - menuWidth)
    } else {
        setWidth(windowSize.width * 0.95)
    }
}

const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}

export default Schedule

