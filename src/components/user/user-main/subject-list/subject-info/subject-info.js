import React, { useContext, useEffect, useRef, useState } from "react"

import "./subject-info.sass"
import { FingerprintContext, UserContext } from "context"
import { useParams } from "react-router-dom"
import { changeSubject, createSubject, getSubject, getTeachers } from "api"
import cogoToast from "cogo-toast"
import Dropdown from "components/dropdown/dropdown"


const SubjectInfo = () => {
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const params = useParams()
    const id = params.id
    const subject = user.subjects?.find((e) => e.id === id)
    const nameInput = useRef()
    const [name, setName] = useState(subject?.name || "")
    const [teachers, setTeachers] = useState([])
    const [selectedTeacher, setSelectedTeacher] = useState(subject?.teacher || "")

    useEffect(() => {
        validate()
    }, [name, selectedTeacher])

    useEffect(() => {
        const color = selectedTeacher ? "white" : "gray"
        setPlaceholderColor(color)
    }, [selectedTeacher])

    useEffect(() => {
        if (id && !subject) {
            const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
            getSubject(fingerprint, id)
                .then((s) => {
                    hide()
                    setName(s.name)
                    setSelectedTecher(s.teacher)
                })
                .catch((error) => {
                    hide()
                    cogoToast.error("Ошибка.", { position: "top-right" })
                })
        }
    }, [])

    useEffect(() => {
        getTeachers(fingerprint)
            .then((ts) => {
                setTeachers(ts.map((t) => ({ key: t.id, value: t.name, text: t.name })))
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    const validate = () => {
        const isValid = name && selectedTeacher
        setSaveBtnVisibility(isValid)
    }

    const handleTeacher = (_, data) => setSelectedTeacher(data.value)

    const handleName = () => setName(nameInput.current.value)

    const handleSave = () => {
        id ? handleChange() : handleCreate()
    }

    const handleCreate = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        createSubject(fingerprint, name, selectedTeacher)
            .then(() => {
                hide()
                cogoToast.success("Предмет добавлен.", { position: "top-right" })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
            })
    }

    const handleChange = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        changeSubject(fingerprint, id, name, selectedTeacher)
            .then(() => {
                hide()
                cogoToast.success("Предмет изменен.", { position: "top-right" })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
            })
    }

    return (
        <div className="subject-info-con">
            <h1>{ id ? "Редактирование" : "Создание" } предмета</h1>
            <div className="input-con">
                <input placeholder="Название предмета" onChange={ handleName } ref={ nameInput } value={ name } />
                <Dropdown placeholder="Преподаватель" options={ teachers } defaultValue={ selectedTeacher }
                                               onChange={ handleTeacher } search
                />
            </div>
            <button className="save-button" onClick={ handleSave }>Сохранить</button>
        </div>
    )
}

export default SubjectInfo

const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}

const setPlaceholderColor = (color) => {
    const placeholder = document.querySelector(".text")
    if (placeholder) placeholder.style.color = color
}
