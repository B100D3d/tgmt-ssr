import React, {useContext, useEffect, useRef, useState} from "react"
import { useParams, useHistory } from "react-router-dom"

import "./register.sass"
import { FingerprintContext, UserContext, UserMenuOpenContext } from "context"
import useWindowSize from "hooks/useWindowSize.hook"
import { getRecords, getStudentRecords, sendRecords } from "api"
import cogoToast from "cogo-toast"
import MonthSelector from "./month-selector/month-selector"
import logout from "helpers/logout"

import ReactDataGrid from "react-data-grid"

const range = (size, start) => [...Array(size).keys()].map((key) => key + start)

const getRows = records => records.map(({ name, records }) => ({ name, ...records }))


const getDaysCount = (m) => {
    const year = new Date().getFullYear()
    const month = m === 11 ? 0 : m === 0 ? 11 : m + 1
    return new Date(year, month, 0).getDate()
}

const getColumns = (month, role) => {
    const isEditable = role === "Admin" || role === "Teacher"
    const isStudent = role === "Student"
    return range(getDaysCount(month) + 1, 0).map((i) => {
        if (i === 0) return { key: "name", name: isStudent ? "Предмет" : "Студент",
            resizable: true, width: 150, frozen: true }
        return { key: `${ i }`, name: i, editable: isEditable, resizable: true, width: 50 }
    })
}


const Register = () => {

    const params = useParams()
    const history = useHistory()

    const [isOpen] = useContext(UserMenuOpenContext)
    const { user, setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    const isStudent = user.role === "Student"
    const groupId = user.group?.id || params.group
    const subjectId = params.subject

    const [rows, setRows] = useState([])
    const [changedCells, setChangedCells] = useState([])
    const [width, setWidth] = useState()
    const [records, setRecords] = useState()
    const [month, setMonth] = useState()
    const [columns, setColumns] = useState([])
    const monthTimeout = useRef()

    const windowSize = useWindowSize()

    const handleRecords = () => {
        clearTimeout(monthTimeout.current)
        monthTimeout.current = setTimeout(() => {
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            const getRecordsFunc = isStudent ? getStudentRecords : getRecords
            getRecordsFunc(month, groupId, subjectId, fingerprint)
                .then((r) => {
                    hide()
                    cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                    setRecords(r)
                    setChangedCells([])
                })
                .catch((error) => {
                    hide()
                    cogoToast.error("Ошибка.", { position: "top-right" })
                    if (error.response.status === 401 || error.response.status === 403) {
                        logout(history, setUser, setError)
                    }
                })
        }, 500)
    }

    useEffect(() => {
        month && handleRecords()
    }, [month])

    useEffect(() => {
        month && setColumns(getColumns(month, user.role))
    }, [month])

    useEffect(() => {
        records && setRows(getRows(records))
    }, [records])

    useEffect(() => {
        resize(isOpen, windowSize, setWidth)
    }, [isOpen, windowSize])

    useEffect(() => {
        new Promise(r => setTimeout(r, 500)).then(() => {
            document.querySelector(".register-container").classList.add("anim")
        })
    }, [])

    useEffect(() => setSaveBtnVisibility(changedCells.length), [changedCells])

    const onGridRowsUpdated = (data) => {
        const day = data.cellKey
        const updated = data.updated[day]
        const { toRow, fromRow } = data
        const rowsCount = toRow - fromRow + 1
        const newRows = [...rows]
        const newChangedCells = [...changedCells]

        range(rowsCount, fromRow).forEach((i) => {
            const currCellValue = rows[i][day] ?? ""
            if(currCellValue !== updated) {
                const name = rows[i].name
                newRows[i] = { ...newRows[i], ...data.updated }
                const cell =  newChangedCells.find((c) => c.name === name)
                if(cell) {
                    cell.records[day] = updated
                } else {
                    const records = { [day]: updated }
                    newChangedCells.push({ name, records })
                }
            }
        })
        setRows(newRows)
        setChangedCells(newChangedCells)
    }

    const handleSave = () => {
        document.querySelector(".save-button").disabled = true
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        sendRecords(fingerprint, month, groupId, subjectId, changedCells)
            .then((r) => {
                document.querySelector(".save-button").disabled = false
                hide()
                cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                setRecords(r)
                setChangedCells([])
            })
            .catch(error => {
                document.querySelector(".save-button").disabled = false
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }


    return (
        <div className="register-container">
            <h1>Журнал</h1>
            <div className="buttons-container">
                <MonthSelector onChange={ setMonth } />
                <button className="save-button" onClick={ handleSave }>Сохранить</button>
            </div>
            <div className="register">
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

export default Register