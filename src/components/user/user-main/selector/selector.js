import React, { useContext, useEffect, useState, useMemo } from "react"

import "./selector.sass"
import useGradient from "hooks/useGradient"
import { FingerprintContext, UserContext } from "context"
import { Link, useParams, useLocation } from "react-router-dom"
import { deleteGroup, getSubjects } from "services"
import cogoToast from "cogo-toast"
import useLogout from "hooks/useLogout"

const noDeg = ({ deg, ...rest }) => rest

const getCSSProperties = (gradient) => {
    const colors = {}
    
    for (const name in noDeg(gradient)) {
        colors[name] = gradient[name].color
    }
    return colors
}

const Selector = ({ type, title, deletable }) => {
    const logout = useLogout()
    const params = useParams()
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const years = useMemo(() =>
        new Set(user.groups.map(({ year }) => year).sort((a, b) => a - b)), [user.groups])
    const [subjects, setSubjects] = useState([])
    const entities = type === "group"
        ? useMemo(() => user.groups.filter((group) => params.year ? group.year === +params.year : true), [user.groups, params])
        : type === "year"
        ? useMemo(() => Array.from(years), [years])
        : subjects

    useEffect(() => {
        if (type === "subject") {
            if (user.role === "Admin") {
                getSubjects(fingerprint, params.group)
                    .then(setSubjects)
                    .catch((error) => {
                        if(error.response.status === 401 || error.response.status === 403) {
                            logout()
                        }
                    })
            }
            if (user.role === "Teacher") {
                const group = user.groups.find((g) => g.id === params.group)
                const subjectsId = group.subjects.map((s) => s.id)
                setSubjects(user.subjects.filter((s) => subjectsId.includes(s.id)))
            }
        }
    }, [])


    return (
        <div className="user-main-container selector">
            <h1>{ title }</h1>
            { !deletable
                ? <h2>{ type === "group" ? "Выбор группы"
                    : type === "year" ? "Выбор курса"
                        : "Выбор предмета" }
                  </h2>
                : <Link className="plus" to={ `${ location.pathname }/new` }>+</Link>
            }
            <div className="selector__items">
                { entities.map((e) => 
                    <Item key={ e.id || e } name={ e.name || e }
                          id={ e.id || e } type={ type } deletable={ deletable } />
                )}
            </div>
        </div>
        
    )
}

const Item = ({ name, id, type, deletable }) => {
    const { user, setUser } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const [gradient, setHover] = useGradient()
    const CSSProperties = getCSSProperties(gradient)
    const colors = Object.values(noDeg(gradient))
    const colorKeys = Object.keys(noDeg(gradient))
    const location = useLocation()
    
    const styles = {
        ...CSSProperties,
        transition: `
            ${ colorKeys[0] } .5s linear,
            ${ colorKeys[1] } .5s linear,
            ${ colorKeys[2] } .5s linear`,
        background: `
            linear-gradient(
                ${ gradient.deg },
                var(${ colorKeys[0] }) ${ colors[0].percent },
                var(${ colorKeys[1] }) ${ colors[1].percent },
                var(${ colorKeys[2] }) ${ colors[2].percent }
            )`
    }

    const handleMouseOver = () => setHover(true)
    const handleMouseOut = () => setHover(false)

    const handleDelete = (e) => {
        e.stopPropagation()
        e.preventDefault()
        const target = e.target
        const id = target.parentElement.id
        disableBtn(target)
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        deleteGroup(fingerprint, id)
            .then(() => {
                hide()
                cogoToast.success("Группа удалена.", { position: "top-right" })
                setUser({
                    ...user,
                    groups: user.groups.filter((g) => g.id !== id)
                })
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
        <Link to={ `${ location.pathname }/${ id }` }>
            <div className="selector__item" id={ type } style={ styles }
                onMouseOver={ handleMouseOver } onMouseOut={ handleMouseOut }>
                { deletable && <div className="delete" onClick={handleDelete} id={id}>
                    <span>&#215;</span>
                </div> }
                <p className="name">{ name }</p>
                <p className="size">{ name }</p>
            </div>
        </Link>
    )
}

export default Selector

const disableBtn = (e) => e.style.pointerEvents = "none"
const enableBtn = (e) => e.style.pointerEvents = "auto"