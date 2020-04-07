import React from "react"
import { Link } from "react-router-dom"


const handleClick = (event) => {
    document.querySelector(".active").classList.remove("active")
    event.target.classList.add("active")
}

const StudentList = () => {
    return (
        <>
            <Link to="/user"><li className="active" onClick={ handleClick }>Расписание</li></Link>
            <Link to="/user/grades"><li onClick={ handleClick }>Оценки</li></Link>
            <Link to="/user/absence"><li onClick={ handleClick }>Журнал посещаемости</li></Link>
            <Link to="/user/settings"><li onClick={ handleClick }>Настройки</li></Link>
        </>
    )
}

export default StudentList