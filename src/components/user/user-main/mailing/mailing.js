import React, { useContext, useEffect, useState } from "react"

import "./mailing.sass"
import MyDropdown from "components/dropdown/dropdown"
import { FingerprintContext, UserContext } from "context"
import { CSSTransition } from "react-transition-group"
import {getStudents, getTeachers, mailing} from "api"
import cogoToast from "cogo-toast"

const TYPE_OPTIONS = [
    { key: "All", value: "All", text: "Все" },
    { key: "Groups", value: "Groups", text: "Группы" },
    { key: "Students", value: "Students", text: "Студенты" },
    { key: "Teachers", value: "Teachers", text: "Преподаватели" }
]


const Mailing = () => {
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const [type, setType] = useState()
    const [entities, setEntities] = useState([])
    const [message, setMessage] = useState()
    const [selectedEntities, setSelectedEntities] = useState([])

    useEffect(() => {
        getEntities()
            .then((e) => {
                setEntities(e)
                setSelectedEntities([])
                setMessage("")
            })
            .catch((error) => {
                cogoToast.error("Ошибка.", { position: "top-right" })
            })
    }, [type])

    useEffect(() => {
        !selectedEntities.length && setMessage("")
    }, [selectedEntities])

    const getEntities = async () => {
        const entities = type === "Students"
            ? await getStudents(fingerprint)
            : type === "Teachers"
            ? await getTeachers(fingerprint)
            : type === "Groups"
            ? user.groups
            : []
        return entities.map((e) => ({ key: e.id, value: e.id, text: e.name }))
    }

    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleEntities = (_, data) => setSelectedEntities(data.value)

    const handleType = (_, data) => setType(data.value)

    const handleSend = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        mailing(fingerprint, type, selectedEntities, message)
            .then(() => {
                hide()
                cogoToast.success("Успешно отправлено.", { position: "top-right" })
            })
            .catch(() => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
            })
    }

    return (
        <div className="mailing-container">
            <h1>Рассылка</h1>
            <div className="mailing">
                <div className="type">
                    <h3>Выберите тип получателя</h3>
                    <MyDropdown options={ TYPE_OPTIONS } placeholder="Выберите тип" onChange={ handleType } />
                </div>
                <CSSTransition
                    in={ type && type !== "All" } timeout={ 500 } classNames="fade" unmountOnExit
                >
                    <div className="recipients">
                        <h3>Выберите получателей</h3>
                        <MyDropdown options={ entities } placeholder="Выберите получателей"
                                    multiple search onChange={ handleEntities } />
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={ selectedEntities.length || type === "All" } timeout={ 500 } classNames="fade" unmountOnExit
                >
                    <div className="textarea">
                        <h3>Введите текст</h3>
                        <textarea cols="" rows="10" placeholder="Введите текст рассылки" onChange={ handleMessage } />
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={ !!message } timeout={ 500 } classNames="fade" unmountOnExit
                >
                    <button className="send-btn" onClick={ handleSend }>Отправить</button>
                </CSSTransition>
            </div>
        </div>
    )
}

export default Mailing