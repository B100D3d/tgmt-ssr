import React, { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"


const LINKS = [
    "/user/register",
    "/user/settings",
    "/user"
]

const handleClick = (event) => {
    document.querySelector(".active").classList.remove("active")
    event.target.classList.add("active")
}

const TeachertList = () => {
    const location = useLocation()

    useEffect(() => {
        LINKS.some((link) => {
            if (location.pathname.includes(link)) {
                document.querySelector(`a[href = "${ link }"] li`).classList.add("active")
                return true
            }
        })
    }, [])

    return (
        <>
            <Link to="/user"><li className="active" onClick={ handleClick }>Расписание</li></Link>
            <Link to="/user/register"><li onClick={ handleClick }>Журнал</li></Link>
            <Link to="/user/settings"><li onClick={ handleClick }>Настройки</li></Link>
        </>
    )
}

export default TeachertList