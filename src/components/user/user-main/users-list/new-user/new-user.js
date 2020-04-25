import React, { useContext, useEffect, useRef, useState } from "react"

import Dropdown from "/components/dropdown/dropdown"
import "./new-user.sass"

import { FingerprintContext, UserContext } from "/context"
import cogoToast from "cogo-toast"
import { createStudent } from "/api"

const NewUser = ({ type }) => {
    const nameInput = useRef()
    const emailInput = useRef()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [selectedGroup, setSelectedGroup] = useState()
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const groups = user.groups.map((group) => ({ key: group.id, value: group.id, text: group.name }))

    useEffect(() => {
        validate()
    }, [name, selectedGroup])

    const validate = () => {
        const isValid = name && (type === "Teacher" || selectedGroup)
        setSaveBtnVisibility(isValid)
    }

    const handleGroup = (_, data) => {
        setSelectedGroup(data.value)
        setPlaceholderColor()
    }

    const handleName = () => setName(nameInput.current.value)

    const handleEmail = () => setEmail(emailInput.current.value)

    const handleSave = () => {
        if (email && !emailInput.current.checkValidity()) {
            cogoToast.error("Некорректный e-mail.", { position: "top-right" })
        } else {
            createStudent(fingerprint, name, email, selectedGroup)
                .then((student) => {
                    alert(`Студент ${ student.name } успешно создан! 
                    Логин: ${ student.login }\n Пароль: ${ student.password }`)
                })
                .catch((error) => {
                    cogoToast.error("Ошибка.", { position: "top-right" })
                })
        }
    }

    return (
        <div className="new-user-con">
            <h1>Создание { type === "Student" ? "студента" : "преподавателя" }</h1>
            <div className="input-con">
                <input placeholder="ФИО" onChange={ handleName } ref={ nameInput } />
                <input type="email" placeholder="EMAIL" onChange={ handleEmail } ref={ emailInput } />
                { type === "Student" && <Dropdown placeholder="Группа"
                        options={ groups } defaultValue="" onChange={ handleGroup } /> }
            </div>
            <button className="save-button" onClick={ handleSave }>Спаси и сохрани</button>
        </div>
    )
}

export default NewUser

const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}

const setPlaceholderColor = () => {
    document.querySelector(".text").style.color = "white"
}