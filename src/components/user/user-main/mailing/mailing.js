import React, {useContext, useEffect, useMemo, useState} from "react"
import { useHistory } from "react-router-dom"
import "./mailing.sass"
import loadable from "@loadable/component"
import { FingerprintContext, UserContext } from "context"
import { CSSTransition } from "react-transition-group"
import { getStudents, getTeachers, mailing } from "api"
import cogoToast from "cogo-toast"
import Checkbox from "./checkbox/checkbox"
import logout from "utils/logout"

const Dropdown = loadable(() => import(/* webpackChunkName: "Dropdown" */"components/dropdown/dropdown"))

const TYPE_OPTIONS = [
    { key: "All", value: "All", text: "Все" },
    { key: "Groups", value: "Groups", text: "Группы" },
    { key: "Students", value: "Students", text: "Студенты" },
    { key: "Teachers", value: "Teachers", text: "Преподаватели" }
]


const Mailing = () => {
    const history = useHistory()
    const { user, setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const [type, setType] = useState()
    const [entities, setEntities] = useState([])
    const [message, setMessage] = useState()
    const [selectedEntities, setSelectedEntities] = useState([])
    const [disabledRecipients, setDisabledRecipients] = useState(false)
    const recipientsPlaceholder = useMemo(() => disabledRecipients
        ? "Все получатели выбраны" : "Выберите получателей", [disabledRecipients])


    useEffect(() => {
        getEntities()
            .then((e) => {
                setEntities(e)
                setSelectedEntities(disabledRecipients ? e : [])
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
                logout(history, setUser, setError)
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
                hide()
                cogoToast.success("Успешно отправлено.", { position: "top-right" })
            })
            .catch(() => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }

    const handleAll = (e) => {
        const checked = e.target.checked
        if (checked) {
            setDisabledRecipients(true)
            setSelectedEntities([...entities])
        } else {
            setDisabledRecipients(false)
            setSelectedEntities([])
        }
    }

    return (
        <div className="mailing-container">
            <h1>Рассылка</h1>
            <div className="mailing">
                <div className="type">
                    <h3>Выберите тип получателя</h3>
                    <Dropdown options={ TYPE_OPTIONS } placeholder="Выберите тип" onChange={ handleType } />
                </div>
                <CSSTransition
                    in={ !!(type && type !== "All") } timeout={ 500 } classNames="fade" unmountOnExit
                >
                    <div className="recipients">
                        <h3>Выберите получателей</h3>
                        <div className="input-wrapper">
                            <Dropdown options={ entities } placeholder={ recipientsPlaceholder }
                                      multiple search onChange={ handleEntities } disabled={ disabledRecipients } />
                            <Checkbox onClick={ handleAll } />
                        </div>
                    </div>
                </CSSTransition>
                <CSSTransition
                    in={ !!(selectedEntities.length || type === "All") } timeout={ 500 } classNames="fade" unmountOnExit
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