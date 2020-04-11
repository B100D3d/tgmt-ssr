import React, { useContext, useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import loadable from "@loadable/component"
const ReactDataGrid = loadable(() => import("react-data-grid"))

import "./register.sass"
import { UserContext, UserMenuOpenContext } from "/context"
import useWindowSize from "/hooks/useWindowSize.hook"
import { getRecords, getStudentRecords } from "/api"
import cogoToast from "cogo-toast"
import MonthSelector from "./month-selector/month-selector"
import back from "/static/previous.svg"



const range = (size, start) => [...Array(size).keys()].map((key) => key + start)

const getRows = (records) => {
    return records.reduce((acc, curr) => {
        const recordsObj = { ...curr.records }
        acc.push({ entity: curr.entity, ...recordsObj })
        return acc
    }, [])
}


const Register = () => {

    const params = useParams()
    const history = useHistory()

    const [isOpen] = useContext(UserMenuOpenContext)
    const { user } = useContext(UserContext)

    const isAdmin = user.role === "Admin"
    const isStudent = user.role === "Student"
    const groupId = user.group?.id || params.group
    const subjectId = params.subject

    const [rows, setRows] = useState([])
    const [changedCells, setChangedCells] = useState([])
    const [width, setWidth] = useState()
    const [records, setRecords] = useState()

    const windowSize = useWindowSize()

    const handleRecords = (month) => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        const getRecordsFunc = isStudent ? getStudentRecords : getRecords
        getRecordsFunc(month, groupId, subjectId)
            .then((r) => {
                hide()
                cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                setRecords(r)
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
            })
    }

    useEffect(() => {
        records && setRows(getRows(records))
    }, [records])

    useEffect(() => {
        resize(isOpen, windowSize, setWidth)
    }, [isOpen, windowSize])

    useEffect(() => {
        new Promise(r => setTimeout(r, 500)).then(() => {
            document.querySelector(".react-grid-Container").classList.add("anim")
        })
    }, [])

    useEffect(() => setSaveBtnVisibility(changedCells.length), [changedCells])

    const [columns, setColumns] = useState(range(32, 0).map((i) => {
        if (i === 0) return { key: "entity", name: isStudent ? "Предмет" : "Студент",
            resizable: true, width: 150 }
        return { key: `${ i - 1 }`, name: i, editable: isAdmin, resizable: true, width: 50 }
    }))

    const onBack = () => {
        history.goBack()
    }

    return (
        <div className="register-container">
            { !isStudent && <img src={back} alt="back" onClick={ onBack }/> }
            <h1>Журнал</h1>
            <div className="buttons-container">
                <MonthSelector onChange={ handleRecords } />
                <button className="save-button">Сохранить</button>
            </div>
            <div className="register">
                <ReactDataGrid
                    columns={ columns }
                    rowGetter={ i => rows[i] }
                    rowsCount={ rows.length }
                    minWidth={ width }
                    enableCellSelect={ true }
                    // onGridRowsUpdated={ onGridRowsUpdated }
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