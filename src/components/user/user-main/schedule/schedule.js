import React, { useEffect, useContext, useState, useRef } from "react"
import { useParams, useHistory } from "react-router-dom"
import SelectEditor from "./select-editor"
import ReactDataGrid from "react-data-grid"
import { getSchedule, getSubjects, sendSchedule } from "api"
import { UserMenuOpenContext, UserContext, FingerprintContext } from "context"
import { range } from "utils"
import useWindowSize from "hooks/useWindowSize.hook"

import cogoToast from "cogo-toast"
import logout from "utils/logout"

import "./schedule.sass"
import ScheduleSwitches from "./schedule-switches/schedule-switches"

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
        const weekday = curr.weekday + 1
        const currClassNumber = curr.classNumber + 1

        const scheduleItem = acc.find(({ classNumber }) => classNumber === currClassNumber)
        scheduleItem[weekday] = `${ curr.subject.name } (${ curr.subject.teacher })`

        return acc
    }, DEFAULT_ROWS.map(r => ({ ...r })))
}

const Schedule = () => {

    const params = useParams()
    const history = useHistory()

    const [isOpen] = useContext(UserMenuOpenContext)
    const { user, setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    const isAdmin = user.role === "Admin"
    const isStudent = user.role === "Student"
    const group = user.group?.id || params.group

    const [rows, setRows] = useState(DEFAULT_ROWS.map(r => ({ ...r })))
    const [changedCells, setChangedCells] = useState([])
    const [width, setWidth] = useState()
    const [schedule, setSchedule] = useState(user.schedule)
    const [switchesState, setSwitches] = useState()
    const switchTimeout = useRef()

    const windowSize = useWindowSize()

    const [subjectTypes, setSubjectTypes] = useState()

    const handleSchedule = () => {
        clearTimeout(switchTimeout.current)
        switchTimeout.current = setTimeout(() => {
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            getSchedule(group, switchesState)
                .then((s) => {
                    hide()
                    cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                    setSchedule(s)
                    setChangedCells([])
                })
                .catch((error) => {
                    hide()
                    cogoToast.error("Ошибка.", { position: "top-right" })
                    if(error.response.status === 401 || error.response.status === 403) {
                        logout(history, setUser, setError)
                    }
                })
        }, 500)
    }

    useEffect(() => {
        switchesState && handleSchedule()
    }, [switchesState])

    useEffect(() => {
        if (isAdmin) {
            getSubjects(fingerprint)
                .then((subjects) => {
                    setSubjectTypes(subjects.map((subject) => ({
                        key: subject.id,
                        value: `${ subject.name } (${ subject.teacher })`,
                        text: `${ subject.name } (${ subject.teacher })`
                    })))
                })
                .catch((error) => {
                    if(error.response.status === 401 || error.response.status === 403) {
                        logout(history, setUser, setError)
                    }
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

    useEffect(() => resize(isOpen, windowSize, setWidth), [isOpen, windowSize])

    useEffect(() => {
        new Promise(r => setTimeout(r, 500)).then(() => {
            document.querySelector(".schedule-container").classList.add("anim")
        })
    }, [])

    useEffect(() => setSaveBtnVisibility(changedCells.length), [changedCells])

    const [columns, setColumns] = useState([
        { key: "classNumber", name: "№ пары", resizable: true, width: 80 },
        { key: "1", name: "Понедельник", editable: isAdmin, resizable: true },
        { key: "2", name: "Вторник", editable: isAdmin, resizable: true },
        { key: "3", name: "Среда", editable: isAdmin, resizable: true },
        { key: "4", name: "Четверг", editable: isAdmin, resizable: true },
        { key: "5", name: "Пятница", editable: isAdmin, resizable: true },
        { key: "6", name: "Суббота", editable: isAdmin, resizable: true }
    ])

    const onGridRowsUpdated = (data) => {
        if(Object.values(data.updated)[0] !== undefined) {
            const weekday = data.cellKey - 1
            let { toRow, fromRow } = data
            const rowsCount = toRow - fromRow + 1
            const subject = subjectTypes.find((subject) => subject.value === data.updated[weekday + 1]) || { key: "" }
            const newRows = [...rows]
            const newChangedCells = [...changedCells]

            range(rowsCount, fromRow).forEach((i) => {
                newRows[i] = {...newRows[i], ...data.updated }
                const classNumber = i
                const cell = newChangedCells.find((c) => c.weekday === weekday && c.classNumber === classNumber)
                if (cell) {
                    cell.subjectID = subject.key
                } else {
                    newChangedCells.push({ weekday, classNumber, subjectID: subject.key })
                }
            })
            setRows(newRows)
            setChangedCells(newChangedCells)
        }
    }

    const handleSave = () => {
        document.querySelector(".save-button").disabled = true
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        sendSchedule(fingerprint, group, switchesState, changedCells)
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
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }

    return (
        <div className="schedule-container">
            <h1>Расписание</h1>
            <div className="buttons-container">
                <ScheduleSwitches onChange={ setSwitches }
                                  firstExecution={ !isStudent }
                                  isAdmin={ isAdmin }
                />
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
                    cellRangeSelection={{
                        onStart: args => setSelectEditorPosition(args.cursorCell.idx > 4)
                    }}
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

const setSelectEditorPosition = right => {
    right
        ? document.querySelector(".react-grid-Canvas").classList.add("right")
        : document.querySelector(".react-grid-Canvas").classList.remove("right")
}

export default Schedule

