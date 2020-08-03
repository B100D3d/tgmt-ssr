import React, { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import "./register.sass"
import { FingerprintContext, UserContext } from "context"
import { getRecords, getStudentRecords, sendRecords } from "services"
import cogoToast from "cogo-toast"
import MonthSelector from "./month-selector/month-selector"
import useLogout from "hooks/useLogout"
import { range } from "utils"
import DataGrid from "components/data-grid/data-grid"

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

    const logout = useLogout()
    const params = useParams()

    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    const isStudent = user.role === "Student"
    const groupId = user.group?.id || params.group
    const subjectId = params.subject

    const [rows, setRows] = useState([])
    const [changedCells, setChangedCells] = useState([])
    const [records, setRecords] = useState()
    const [month, setMonth] = useState()
    const [columns, setColumns] = useState([])
    const monthTimeout = useRef()

    const handleRecords = () => {
        clearTimeout(monthTimeout.current)
        monthTimeout.current = setTimeout(() => {
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            const getRecordsFunc = isStudent ? getStudentRecords : getRecords
            getRecordsFunc(fingerprint, month, groupId, subjectId)
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
                        logout()
                    }
                })
        }, 500)
    }

    useEffect(() => {
        if(month) handleRecords()
    }, [month])

    useEffect(() => {
        if(month) setColumns(getColumns(month, user.role))
    }, [month])

    useEffect(() => {
        if(records) setRows(getRows(records))
    }, [records])

    const onRowsUpdate = (data) => {
        const day = data.cellKey
        const updated = data.updated[day]
        const { fromRow, rowsCount } = data
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
                    logout()
                }
            })
    }

    return (
        <div className="user-main-container register-container">
            <h1>Журнал</h1>
            <div className="buttons-container">
                <MonthSelector onChange={ setMonth } />
                <button
                    className={`save-button ${changedCells.length ? "visible" : ""}`}
                    onClick={ handleSave }
                >
                    Сохранить
                </button>
            </div>
            <div className="register">
                <DataGrid
                    columns={ columns }
                    rows={ rows }
                    onUpdate={ onRowsUpdate }
                />
            </div>
        </div>
    )
}

export default Register