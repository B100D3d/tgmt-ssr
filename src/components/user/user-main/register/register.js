import React, {useContext, useEffect, useRef, useState} from "react"
import { useParams } from "react-router-dom"
import loadable from "@loadable/component"
const ReactDataGrid = loadable(() => import("react-data-grid"))

import "./register.sass"
import { FingerprintContext, UserContext, UserMenuOpenContext } from "context"
import useWindowSize from "hooks/useWindowSize.hook"
import { getRecords, getStudentRecords, sendRecords } from "api"
import cogoToast from "cogo-toast"
import MonthSelector from "./month-selector/month-selector"



const range = (size, start) => [...Array(size).keys()].map((key) => key + start)

const getRows = (records) => {
    return records.reduce((acc, curr) => {
        const recordsObj = curr.records.reduce((acc, curr) => {
            acc[curr.day] = curr.record
            return acc
        }, {})
        acc.push({ entity: curr.entity, ...recordsObj })
        return acc
    }, [])
}

const getDaysCount = (m) => {
    const year = new Date().getFullYear()
    const month = m === 11 ? 0 : m === 0 ? 11 : m + 1
    return new Date(year, month, 0).getDate()
}

const getColumns = (month, role) => {
    const isAdmin = role === "Admin"
    const isStudent = role === "Student"
    return range(getDaysCount(month) + 1, 0).map((i) => {
        if (i === 0) return { key: "entity", name: isStudent ? "Предмет" : "Студент",
            resizable: true, width: 150 }
        return { key: `${ i }`, name: i, editable: isAdmin, resizable: true, width: 50 }
    })
}


const Register = () => {

    const params = useParams()

    const [isOpen] = useContext(UserMenuOpenContext)
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    const isAdmin = user.role === "Admin"
    const isStudent = user.role === "Student"
    const groupId = user.group?.id || params.group
    const subjectId = params.subject

    const [rows, setRows] = useState([])
    const [changedCells, setChangedCells] = useState([])
    const [width, setWidth] = useState()
    const [records, setRecords] = useState()
    const [month, setMonth] = useState(new Date().getMonth())
    const [columns, setColumns] = useState([])
    const monthTimeout = useRef()

    const windowSize = useWindowSize()

    const handleRecords = (month) => {
        clearTimeout(monthTimeout.current)
        monthTimeout.current = setTimeout(() => {
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            const getRecordsFunc = isStudent ? getStudentRecords : getRecords
            getRecordsFunc(month, groupId, subjectId, fingerprint)
                .then((r) => {
                    hide()
                    cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                    setMonth(month)
                    setRecords(r)
                })
                .catch((error) => {
                    hide()
                    cogoToast.error("Ошибка сервера.", { position: "top-right" })
                })
        }, 500)
    }

    useEffect(() => {
        setColumns(getColumns(month, user.role))
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

    useEffect(() => {
        console.log(changedCells)
    }, [changedCells])


    const onGridRowsUpdated = (data) => {
        const day = +data.cellKey
        const updated = data.updated[data.cellKey]
        const { toRow, fromRow } = data
        const rowsCount = toRow - fromRow + 1
        const newRows = [...rows]
        const newChangedCells = [...changedCells]

        range(rowsCount, fromRow).map((i) => {
            const student = rows[i].entity
            newRows[i] = { ...newRows[i], ...data.updated }
            const cell =  newChangedCells.find((c) => c.student === student)
            if (cell) {
                const record = cell.records.find((r) => r.day === day)
                if (record) {
                    record.record = updated
                } else {
                    cell.records.push({ day, record: updated })
                }
            } else {
                newChangedCells.push({ student, records: [{ day, record: updated }] })
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
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
            })
    }


    return (
        <div className="register-container">
            <h1>Журнал</h1>
            <div className="buttons-container">
                <MonthSelector onChange={ handleRecords } />
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