import React, { useContext, useEffect, useRef, useState } from "react"

import "./group-info.sass"
import { FingerprintContext, UserContext } from "context"
import { useParams, useHistory } from "react-router-dom"
import {changeGroup, createGroup} from "api"
import cogoToast from "cogo-toast"
import logout from "helpers/logout";


const GroupInfo = () => {
    const { user, setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const params = useParams()
    const history = useHistory()
    const id = params.id
    const nameInput = useRef()
    const yearInput = useRef()
    const [name, setName] = useState(id ? user.groups.find((g) => g.id === id)?.name : "")
    const [year, setYear] = useState(id ? user.groups.find((g) => g.id === id)?.year : undefined)

    useEffect(() => {
        validate()
    }, [name, year])

    const validate = () => {
        const isValid = name && year && yearInput.current.checkValidity()
        setSaveBtnVisibility(isValid)
    }

    const handleName = () => setName(nameInput.current.value)

    const handleYear = () => setYear(+yearInput.current.value)

    const handleSave = () => {
        id ? change() : create()
    }

    const create = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        createGroup(fingerprint, name, year)
            .then((group) => {
                hide()
                cogoToast.success("Группа добавлена.", { position: "top-right" })
                setUser({
                    ...user,
                    groups: [...user.groups, group].sort((a, b) => a.name > b.name ? 1 : -1)
                })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }

    const change = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        changeGroup(fingerprint, name, year, id)
            .then((group) => {
                hide()
                cogoToast.success("Группа изменена.", { position: "top-right" })
                setUser({
                    ...user,
                    groups: user.groups.map((g) => g.id === id ? group : g).sort((a, b) => a.name > b.name ? 1 : -1)
                })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }

    return (
        <div className="group-info-con">
            <h1>{ id ? "Редактирование" : "Создание" } группы</h1>
            <div className="input-con">
                <input placeholder="Название" required pattern="[А-Я0-9]{1,}"
                       ref={ nameInput } onChange={ handleName } value={ name } />
                <input placeholder="Курс" required pattern="[1-4]"
                       ref={ yearInput } onChange={ handleYear } value={ year } />
            </div>
            <button className="save-button" onClick={ handleSave } >Сохранить</button>
        </div>
    )
}

export default GroupInfo


const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}