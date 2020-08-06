import React, { useEffect, useContext, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import SelectEditor from "./select-editor/select-editor"
import { getSchedule, getSubjects, sendSchedule } from "services"
import { UserContext, FingerprintContext } from "context"
import { range } from "utils"
import cogoToast from "cogo-toast"
import useLogout from "hooks/useLogout"
import ScheduleSwitches from "./schedule-switches/schedule-switches"
import loadable from "@loadable/component"

const DataGrid = loadable(() =>
    import(/* webpackChunkName: "DataGrid" */ "components/data-grid/data-grid")
)

import "./schedule.sass"

const DEFAULT_SCHEDULE_ITEM = {
    1: "",
    2: "",
    3: "",
    4: "",
    5: "",
    6: "",
}

const DEFAULT_ROWS = () =>
    range(7, 1).map((i) => ({ classNumber: i, ...DEFAULT_SCHEDULE_ITEM }))

const DEFAULT_COLUMNS = (isAdmin) => [
    { key: "classNumber", name: "№ пары", resizable: true },
    { key: "1", name: "Понедельник", editable: isAdmin, resizable: true },
    { key: "2", name: "Вторник", editable: isAdmin, resizable: true },
    { key: "3", name: "Среда", editable: isAdmin, resizable: true },
    { key: "4", name: "Четверг", editable: isAdmin, resizable: true },
    { key: "5", name: "Пятница", editable: isAdmin, resizable: true },
    { key: "6", name: "Суббота", editable: isAdmin, resizable: true },
]

const getRows = (schedule) => {
    return schedule.reduce((acc, curr) => {
        const weekday = curr.weekday + 1
        const currClassNumber = curr.classNumber + 1

        const scheduleItem = acc.find(
            ({ classNumber }) => classNumber === currClassNumber
        )
        scheduleItem[weekday] = `${curr.subject.name} (${curr.subject.teacher})`

        return acc
    }, DEFAULT_ROWS())
}

const Schedule = () => {
    const logout = useLogout()
    const params = useParams()

    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    const isAdmin = user.role === "Admin"
    const isStudent = user.role === "Student"
    const group = user.group?.id || params.group

    const [rows, setRows] = useState(() => DEFAULT_ROWS())
    const [columns, setColumns] = useState(() => DEFAULT_COLUMNS(isAdmin))
    const [changedCells, setChangedCells] = useState([])
    const [schedule, setSchedule] = useState(user.schedule)
    const [switchesState, setSwitches] = useState()
    const switchTimeout = useRef()

    const [subjectTypes, setSubjectTypes] = useState()

    const handleSchedule = () => {
        clearTimeout(switchTimeout.current)
        switchTimeout.current = setTimeout(() => {
            const { hide } = cogoToast.loading("Загрузка...", {
                hideAfter: 0,
                position: "top-right",
            })
            getSchedule(fingerprint, group, switchesState)
                .then((s) => {
                    cogoToast.success("Данные успешно загружены.", {
                        position: "top-right",
                    })
                    setSchedule(s)
                    setChangedCells([])
                })
                .catch((error) => {
                    cogoToast.error("Ошибка.", { position: "top-right" })
                    if (
                        error.response.status === 401 ||
                        error.response.status === 403
                    ) {
                        logout()
                    }
                })
                .finally(hide)
        }, 500)
    }

    useEffect(() => {
        if (switchesState) handleSchedule()
    }, [switchesState])

    useEffect(() => {
        if (isAdmin) {
            getSubjects(fingerprint)
                .then((subjects) => {
                    setSubjectTypes(
                        subjects.map((subject) => ({
                            key: subject.id,
                            value: `${subject.name} (${subject.teacher})`,
                            text: `${subject.name} (${subject.teacher})`,
                        }))
                    )
                })
                .catch((error) => {
                    if (
                        error.response.status === 401 ||
                        error.response.status === 403
                    ) {
                        logout()
                    }
                })
        }
    }, [isAdmin])

    useEffect(() => {
        if (schedule) setRows(getRows(schedule))
    }, [schedule])

    useEffect(() => {
        if (subjectTypes) {
            setColumns(
                columns.map((column, i) =>
                    i === 0
                        ? column
                        : {
                              ...column,
                              editor: React.forwardRef((props, ref) => (
                                  <SelectEditor
                                      ref={ref}
                                      {...props}
                                      options={subjectTypes}
                                  />
                              )),
                          }
                )
            )
        }
    }, [subjectTypes])

    const onRowsUpdate = (data) => {
        if (Object.values(data.updated)[0] !== undefined) {
            const weekday = data.cellKey - 1
            const { fromRow, rowsCount } = data
            const subject = subjectTypes.find(
                (subject) => subject.value === data.updated[weekday + 1]
            ) || { key: "" }
            const newRows = [...rows]
            const newChangedCells = [...changedCells]

            range(rowsCount, fromRow).forEach((i) => {
                newRows[i] = { ...newRows[i], ...data.updated }
                const classNumber = i
                const cell = newChangedCells.find(
                    (c) =>
                        c.weekday === weekday && c.classNumber === classNumber
                )
                if (cell) {
                    cell.subjectID = subject.key
                } else {
                    newChangedCells.push({
                        weekday,
                        classNumber,
                        subjectID: subject.key,
                    })
                }
            })
            setRows(newRows)
            setChangedCells(newChangedCells)
        }
    }

    const handleSave = () => {
        document.querySelector(".save-button").disabled = true
        const { hide } = cogoToast.loading("Загрузка...", {
            hideAfter: 0,
            position: "top-right",
        })
        sendSchedule(fingerprint, group, switchesState, changedCells)
            .then((s) => {
                document.querySelector(".save-button").disabled = false
                hide()
                cogoToast.success("Данные успешно загружены.", {
                    position: "top-right",
                })
                setSchedule(s)
                setChangedCells([])
            })
            .catch((error) => {
                document.querySelector(".save-button").disabled = false
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
                if (
                    error.response.status === 401 ||
                    error.response.status === 403
                ) {
                    logout()
                }
            })
    }

    return (
        <div className="user-main-container schedule-container">
            <h1>Расписание</h1>
            <div className="buttons-container">
                <ScheduleSwitches
                    onChange={setSwitches}
                    firstExecution={!isStudent}
                    isAdmin={isAdmin}
                />
                <button
                    className={`save-button ${
                        changedCells.length ? "visible" : ""
                    }`}
                    onClick={handleSave}
                >
                    Сохранить
                </button>
            </div>
            <div className="schedule">
                <DataGrid
                    columns={columns}
                    rows={rows}
                    stretch
                    onUpdate={onRowsUpdate}
                    onSelectedCellChange={(args) =>
                        setSelectEditorPosition(args.idx > 4, args.rowIdx > 2)
                    }
                />
            </div>
        </div>
    )
}

const setSelectEditorPosition = (right, top) => {
    right
        ? (document.body.dataset.rdgSelectRight = "true")
        : (document.body.dataset.rdgSelectRight = "")
    top
        ? (document.body.dataset.rdgSelectTop = "true")
        : (document.body.dataset.rdgSelectTop = "")
}

export default Schedule
