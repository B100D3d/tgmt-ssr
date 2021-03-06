import React, { useContext } from "react"

import "./user-header.sass"
import { WeekContext, UserMenuOpenContext } from "context"
import useWindowSize from "hooks/useWindowSize"
import burger from "static/burger.svg"
import home from "static/home.svg"
import { Link } from "react-router-dom"


const UserHeader = () => {

    const [isOpen, setOpen] = useContext(UserMenuOpenContext)
    const { date, weekNumber, even } = useContext(WeekContext)
    const windowSize = useWindowSize()

    const handleClick = () => {
        windowSize.width > 800 ? setUserMainWidth() : setUserMainTop()
        setOpen(!isOpen)
    }

    const setUserMainWidth = () => {
        if (isOpen) {
            document.querySelector(".user-main").style.width = "95%"
        } else {
            const menuWidth = document.querySelector(".user-menu").clientWidth
            document.querySelector(".user-main").style.width = `calc(95% - ${ menuWidth }px)`
        }
    }

    const setUserMainTop = () => {
        if (isOpen) {
            document.querySelector(".user-main").style.top = "20px"
        } else {
            const menuHeight = document.querySelector(".user-menu").clientHeight
            document.querySelector(".user-main").style.top = `${ menuHeight + 40}px`
        }
    }


    return (
        <header className="user-header">
            <div className="btn-con">
                <div className="burger-con">
                    <img src={ burger } alt="burger" />
                    <button className="burger-btn" onClick={ handleClick } />
                </div>
                <Link to="/" >
                    <img src={ home } alt="home" className="home" />
                </Link>
            </div>
            <p className="week">
                { date || "" }
                <br />
                { weekNumber || "" } { even ? "четная неделя" : "нечетная неделя" }
            </p>
        </header>
    )
}

export default UserHeader