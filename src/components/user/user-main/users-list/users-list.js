import React, { useContext, useEffect, useState, useRef } from "react"

import "./users-list.sass"
import {deleteStudent, deleteTeacher, getStudents, getTeachers} from "/api"
import { FingerprintContext } from "/context"
import cogoToast from "cogo-toast"
import { Link, useLocation } from "react-router-dom"


const UsersList = ({ type }) => {
    const [entities, setEntities] = useState([])
    const [filteringEntities, setFilteringEntities] = useState([])
    const fingerprint = useContext(FingerprintContext)
    const search = useRef()
    const location = useLocation()

    useEffect(() => {
        const getEntitiesFunc = type === "Student" ? getStudents : getTeachers
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        getEntitiesFunc(fingerprint)
            .then((e) => {
                hide()
                cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                setEntities(e)
                setFilteringEntities(e)
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
            })
    }, [])

    useEffect(() => {
        handleChange()
    }, [entities])

    const handleChange = () => {
        setFilteringEntities(entities.filter((e) => {
            const name = e.name.toLowerCase()
            const group = e.group?.name?.toLowerCase()
            const searchValue = search.current.value.toLowerCase()
            return name.includes(searchValue) || group?.includes(searchValue)
        }))
    }

    const handleDelete = (e) => {
        const parent = e.target.parentElement
        const id = parent.id
        disableBtn(parent)
        const deleteEntityFunc = type === "Student" ? deleteStudent : deleteTeacher
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        deleteEntityFunc(fingerprint, id)
            .then(() => {
                hide()
                cogoToast.success("Пользователь удален.", { position: "top-right" })
                setEntities(entities.filter((e) => e.id !== id))
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
                enableBtn(parent)
            })
    }

    return (
        <div className="users-container">
            <h1>{ type === "Student" ? "Студенты" : "Преподаватели" }</h1>
            <div className="navigation-con">
                <input placeholder="Поиск..." ref={ search } onChange={ handleChange } />
                <div className="plus" role="button">+</div>
            </div>
            <ul className="users-list">
                { filteringEntities.map((e) => (
                    <li key={ e.id }>
                        <span>
                            { e.name }
                        </span>
                        <div className="right">
                            <span>{ e.group?.name || "" }</span>
                            <div className="delete" role="button">&#215;</div>
                        </div>
                    </li>
                )) }
            </ul>
        </div>
    )
}

export default UsersList

const disableBtn = (e) => e.style.pointerEvents = "none"
const enableBtn = (e) => e.style.pointerEvents = "auto"
