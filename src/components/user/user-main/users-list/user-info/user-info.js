import React, { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"

import Dropdown from "components/dropdown/dropdown"
import "./user-info.sass"

import { FingerprintContext, UserContext } from "context"
import cogoToast from "cogo-toast"
import { changeTeacher, changeStudent, createStudent, createTeacher, getStudent, getTeacher } from "api"

const UserInfo = ({ type }) => {
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const params = useParams()
    const id = params.id
    const entity = user.entities?.find((e) => e.id === id)
    const nameInput = useRef()
    const emailInput = useRef()
    const [name, setName] = useState(entity?.name || "")
    const [email, setEmail] = useState(entity?.email || "")
    const [selectedGroup, setSelectedGroup] = useState(entity?.group?.id || "")
    const groups = user.groups.map((group) => ({ key: group.id, value: group.id, text: group.name }))

    useEffect(() => {
        validate()
    }, [name, selectedGroup])

    useEffect(() => {
        const color = selectedGroup ? "white" : "gray"
        setPlaceholderColor(color)
    }, [selectedGroup])

    useEffect(() => {
        if (id && !entity) {
            const getEntityFunc = type === "Student" ? getStudent : getTeacher
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            getEntityFunc(fingerprint, id)
                .then((s) => {
                    hide()
                    setName(s.name)
                    setEmail(s.email)
                    s.group && setSelectedGroup(s.group.id)
                })
                .catch((error) => {
                    hide()
                    cogoToast.error("Ошибка.", { position: "top-right" })
                })
        }
    }, [])

    const validate = () => {
        const isValid = name && (type === "Teacher" || selectedGroup)
        setSaveBtnVisibility(isValid)
    }

    const handleGroup = (_, data) => setSelectedGroup(data.value)

    const handleName = () => setName(nameInput.current.value)

    const handleEmail = () => setEmail(emailInput.current.value)

    const handleSave = () => {
        if (email && !emailInput.current.checkValidity()) {
            cogoToast.error("Некорректный e-mail.", { position: "top-right" })
        } else {
            id ? changeEntity() : createEntity()
        }
    }

    const createEntity = () => {
        const createFunc = type === "Student" ? createStudent : createTeacher
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        createFunc(fingerprint, name, email, selectedGroup)
            .then((entity) => {
                hide()
                alert(`${ type === "Student" ? "Студент" : "Преподаватель" } ${ entity.name } успешно создан! 
                    Логин: ${ entity.login }\n Пароль: ${ entity.password }`)
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
            })
    }

    const changeEntity = () => {
        const changeFunc = type === "Student" ? changeStudent : changeTeacher
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        changeFunc(fingerprint, id, name, email, selectedGroup)
            .then((entity) => {
                hide()
                cogoToast.success("Пользователь изменен.", { position: "top-right" })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
            })
    }

    return (
        <div className="user-info-con">
            <h1>{ id ? "Редактирование" : "Создание" } { type === "Student" ? "студента" : "преподавателя" }</h1>
            <div className="input-con">
                <input placeholder="ФИО" onChange={ handleName } ref={ nameInput } value={ name } />
                <input type="email" placeholder="EMAIL" onChange={ handleEmail } ref={ emailInput } value={ email } />
                { type === "Student" && (!id || selectedGroup) && <Dropdown placeholder="Группа"
                        options={ groups } defaultValue={ selectedGroup } onChange={ handleGroup } /> }
            </div>
            <button className="save-button" onClick={ handleSave }>Сохранить</button>
        </div>
    )
}

export default UserInfo

const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}

const setPlaceholderColor = (color) => {
    const placeholder = document.querySelector(".text")
    if (placeholder) placeholder.style.color = color
}