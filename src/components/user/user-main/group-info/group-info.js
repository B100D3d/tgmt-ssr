import React, {useContext, useEffect, useRef, useState} from "react"

import "./group-info.sass"
import Dropdown from "components/dropdown/dropdown"
import { FingerprintContext, UserContext } from "context"
import { useParams } from "react-router-dom"


const GroupInfo = () => {
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const params = useParams()
    const id = params.id
    const nameInput = useRef()
    const yearInput = useRef()
    const [name, setName] = useState("")
    const [year, setYear] = useState()

    useEffect(() => {
        validate()
    }, [name, year])

    const validate = () => {
        const isValid = name && year && yearInput.current.checkValidity()
        setSaveBtnVisibility(isValid)
    }

    const handleName = () => setName(nameInput.current.value)

    const handleYear = () => setYear(yearInput.current.value)

    return (
        <div className="group-info-con">
            <h1>{ id ? "Редактирование" : "Создание" } группы</h1>
            <div className="input-con">
                <input placeholder="Название" pattern="[А-Я0-9]{1,}" ref={ nameInput } onChange={ handleName } />
                <input placeholder="Курс" pattern="[1-4]" ref={ yearInput } onChange={ handleYear } />
            </div>
            <button className="save-button">Сохранить</button>
        </div>
    )
}

export default GroupInfo


const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}