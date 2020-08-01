import React, { useContext, useEffect, useRef, useState } from "react"

import "./subject-list.sass"
import { Link, useLocation, useHistory } from "react-router-dom"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import { FingerprintContext, UserContext } from "context"
import { deleteSubject, getSubjects } from "services"
import cogoToast from "cogo-toast"
import useLogout from "hooks/useLogout"


const SubjectList = () => {
    const logout = useLogout()
    const [subjects, setSubjects] = useState([])
    const [filteringSubjects, setFilteringSubjects] = useState([])
    const fingerprint = useContext(FingerprintContext)
    const { user, setUser } = useContext(UserContext)
    const search = useRef()
    const location = useLocation()

    useEffect(() => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        getSubjects(fingerprint)
            .then((s) => {
                hide()
                cogoToast.success("Данные успешно загружены.", { position: "top-right" })
                setSubjects(s)
                setFilteringSubjects(s)
                setUser({
                    ...user,
                    subjects: s
                })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout()
                }
            })
    }, [])

    useEffect(() => {
        subjects.length && handleChange()
    }, [subjects])

    const handleChange = () => {
        setFilteringSubjects(subjects.filter((s) => {
            const name = s.name.toLowerCase()
            const teacher = s.teacher.toLowerCase()
            const searchValue = search.current.value.toLowerCase()
            return name.includes(searchValue) || teacher.includes(searchValue)
        }))
    }

    const handleDelete = (event) => {
        event.stopPropagation()
        event.preventDefault()
        const target = event.target
        const id = target.parentElement.id
        disableBtn(target)
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        deleteSubject(fingerprint, id)
            .then(() => {
                hide()
                cogoToast.success("Предмет удален.", { position: "top-right" })
                setSubjects(subjects.filter((e) => e.id !== id))
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка сервера.", { position: "top-right" })
                enableBtn(target)
                if (error.response.status === 401 || error.response.status === 403) {
                    logout()
                }
            })
    }


    return (
        <div className="user-main-container subjects-container">
            <h1>Предметы</h1>
            <div className="navigation-con">
                <input placeholder="Поиск..." ref={ search } onChange={ handleChange } />
                <Link className="plus" to={ `${ location.pathname }/new` }>+</Link>
            </div>
            <TransitionGroup className="subjects-list" component="ul">
                { filteringSubjects.map((s) => (
                    <CSSTransition
                        key={ s.id }
                        timeout={ 500 }
                        classNames="fade">
                        <li key={ s.id }>
                            <Link to={ `${ location.pathname }/${ s.id }` }>
                                <span>
                                    { s.name }
                                </span>
                                <div className="right">
                                    <span>{ s.teacher }</span>
                                    <div className="delete" id={ s.id } role="button" onClick={ handleDelete } >
                                        <span>&#215;</span>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    </CSSTransition>
                )) }
            </TransitionGroup>
        </div>
    )
}

export default SubjectList

const disableBtn = (e) => e.style.pointerEvents = "none"
const enableBtn = (e) => e.style.pointerEvents = "auto"