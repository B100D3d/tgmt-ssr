import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { FingerprintContext, UserContext } from "context"
import { CSSTransition } from "react-transition-group"
import loadable from "@loadable/component"
import { getStudents, getTeachers, mailing } from "services"
import cogoToast from "cogo-toast"
import Checkbox from "./checkbox/checkbox"
import useLogout from "hooks/useLogout"

import "./mailing.sass"

const Dropdown = loadable(() => import(/* webpackChunkName: "Dropdown" */"components/dropdown/dropdown"))
//import Dropdown from "components/dropdown/dropdown"

const TYPE_OPTIONS = [
    { key: "All", value: "All", text: "Все" },
    { key: "Groups", value: "Groups", text: "Группы" },
    { key: "Students", value: "Students", text: "Студенты" },
    { key: "Teachers", value: "Teachers", text: "Преподаватели" }
]

const Mailing = () => {
    const logout = useLogout()
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const [type, setType] = useState()
    const [entities, setEntities] = useState([])
    const [selectedEntities, setSelectedEntities] = useState([])
    const [message, setMessage] = useState("")
    const [allSelected, setAllSelected] = useState(false)
    const submitBtn = useRef()
    const recipientsPlaceholder = useMemo(() => allSelected
        ? "Все получатели выбраны" : "Выберите получателей", [allSelected])


    useEffect(() => {
        getEntities()
            .then((e) => {
                setEntities(e)
                setSelectedEntities(allSelected ? e : [])
                setMessage("")
            })
    }, [type])

    useEffect(() => {
        if(!selectedEntities.length) {
            setMessage("")
        }
    }, [selectedEntities])

    useEffect(() => {
        if(message) {
            submitBtn.current.scrollIntoView()
        }
    }, [message])

    const getEntities = async () => {
        try {
            const entities = type === "Students"
                ? await getStudents(fingerprint)
                : type === "Teachers"
                ? await getTeachers(fingerprint)
                : type === "Groups"
                ? user.groups
                : []
            return entities.map((e) => ({ key: e.id, value: e.id, text: e.name }))
        } catch (error) {
            if (error.response.status === 401 || error.response.status === 403) {
                cogoToast.error("Ошибка.", { position: "top-right" })
                logout()
            }
        }
    }

    const handleMessage = (e) => setMessage(e.target.value)

    const handleEntities = (_, data) => setSelectedEntities(data.value)

    const handleType = (_, data) => setType(data.value)

    const handleSend = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        mailing(fingerprint, type, selectedEntities, message)
            .then(() => {
                cogoToast.success("Успешно отправлено.", { position: "top-right" })
            })
            .catch(() => {
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout()
                }
            })
            .finally(hide)
    }

    const handleAll = (e) => {
        const checked = e.target.checked
        setAllSelected(checked)
        setSelectedEntities(checked ? [...entities] : [])
    }

    return (
        <div className="user-main-container mailing-container">
            <h1>Рассылка</h1>
            <div className="mailing">
                <div className="type">
                    <h3>Выберите тип получателя</h3>
                    <Dropdown options={ TYPE_OPTIONS } placeholder="Выберите тип" onChange={ handleType } />
                </div>
                <CSSTransition
                    in={ Boolean(type && type !== "All") }
                    timeout={ 500 }
                    classNames="fade"
                    unmountOnExit
                >
                    <div className="recipients">
                        <h3>Выберите получателей</h3>
                        <div className="input-wrapper">
                            <Dropdown options={ entities } placeholder={ recipientsPlaceholder }
                                      multiple search onChange={ handleEntities } disabled={ allSelected } />
                            <Checkbox onClick={ handleAll } />
                        </div>
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={ Boolean(selectedEntities.length || type === "All") }
                    timeout={ 500 }
                    classNames="fade"
                    unmountOnExit
                >
                    <div className="textarea">
                        <h3>Введите текст</h3>
                        <textarea cols="" rows="10" placeholder="Введите текст рассылки" onChange={ handleMessage } />
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={ Boolean(message) }
                    timeout={ 500 }
                    classNames="fade"
                    unmountOnExit
                >
                    <button
                        ref={ submitBtn }
                        className="send-btn"
                        onClick={ handleSend }>
                        Отправить
                    </button>
                </CSSTransition>
            </div>
        </div>
    )
}

export default Mailing