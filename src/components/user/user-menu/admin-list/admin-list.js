import React from "react"
import { Link } from "react-router-dom"

const handleClick = (event) => {
    document.querySelector(".active").classList.remove("active")
    event.target.classList.add("active")
}

const AdminList = () => {
    return (
        <>
            <Link to="/user"><li className="active" onClick={ handleClick }>Расписание</li></Link>
            <Link to="/user/register"><li onClick={ handleClick }>Журнал</li></Link>
            <Link><li onClick={ handleClick }>Группы</li></Link>
            <Link><li onClick={ handleClick }>Студенты</li></Link>
            <Link><li onClick={ handleClick }>Преподаватели</li></Link>
            <Link><li onClick={ handleClick }>Настройки</li></Link> 
        </>
    )
}

export default AdminList