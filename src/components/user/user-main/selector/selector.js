import React, { useContext, useEffect, useState } from "react"

import s from "./selector.module.sass"
import useGradient from "hooks/useGradient.hook"
import { FingerprintContext, UserContext } from "context"
import { Link, useParams, useLocation } from "react-router-dom"
import { deleteGroup, getSubjects } from "api"
import cogoToast from "cogo-toast";

const noDeg = ({ deg, ...rest }) => rest

const getCSSProperties = (gradient) => {
    const colors = {}
    
    for (const name in noDeg(gradient)) {
        colors[name] = gradient[name].color
    }
    return colors
}


const Selector = ({ type, title, deletable }) => {
    const params = useParams()
    const { user } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const years = new Set(user.groups.map(({ year }) => year).sort((a, b) => a - b))
    const [subjects, setSubjects] = useState([])
    const entities = type === "group"
        ? user.groups.filter((group) => params.year ? group.year === +params.year : true)
        : type === "year"
        ? Array.from(years)
        : subjects

    useEffect(() => {
        if (type === "subject") {
            if (user.role === "Admin") {
                getSubjects(fingerprint, params.group)
                    .then(setSubjects)
                    .catch(console.log)
            }
            if (user.role === "Teacher") {
                const group = user.groups.find((g) => g.id === params.group)
                const subjectsId = group.subjects.map((s) => s.id)
                setSubjects(user.subjects.filter((s) => subjectsId.includes(s.id)))
            }
        }
    }, [])


    return (
        <div className={ s.selector }>
            <h1>{ title }</h1>
            { !deletable
                ? <h2>{ type === "group" ? "Выбор группы"
                    : type === "year" ? "Выбор курса"
                        : "Выбор предмета" }
                  </h2>
                : <Link className={ s.plus } to={ `${ location.pathname }/new` }>+</Link>
            }
            <div className={ s.items }>
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
            })
    }

    return (
        <Link to={ `${ location.pathname }/${ id }` }>
            <div className={ s.item } id={ s[type] } style={ styles }
                onMouseOver={ handleMouseOver } onMouseOut={ handleMouseOut }>
                { deletable && <div className={s.delete} onClick={handleDelete} id={id}>
                    <span>&#215;</span>
                </div> }
                <p className={ s.name }>{ name }</p>
                <p className={ s.size }>{ name }</p>
            </div>
        </Link>
    )
}

export default Selector

const disableBtn = (e) => e.style.pointerEvents = "none"
const enableBtn = (e) => e.style.pointerEvents = "auto"