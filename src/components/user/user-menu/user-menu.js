import React, { useContext } from "react"

import "./user-menu.sass"
import { UserContext } from "context"
import logoutImg from "static/logout.svg"
import AdminList from "./admin-list/admin-list"
import StudentList from "./student-list/student-list"
import TeachersList from "./teacher-list/teacher-list"
import logout from "helpers/logout"
import { useHistory } from "react-router-dom"



const LISTS = {
    Admin: <AdminList />,
    Student: <StudentList />,
    Teacher: <TeachersList />
}

const getRole = (user) => {
    if (user.role === "Admin") {
        return "Администратор"
    } 
    if (user.role === "Student") {
        return `Студент | ${user.group.year} курс | группа ${user.group.name}`
    }
    if (user.role === "Teacher") {
        return "Преподаватель"
    }
}


const UserMenu = () => {

    const { user, setUser, setError } = useContext(UserContext)
    const list = LISTS[user.role]
    const role = getRole(user)
    const history = useHistory()

    const handleClick = () => logout(history, setUser, setError)


    return (
        <div className="user-menu">
            <div className="user-info">
                <div className="user-text">
                    <h3>{ user.name }</h3>
                    <p>{ role }</p>
                </div>
                <div className="logout-con">
                    <img src={ logoutImg } alt="logout" />
                    <button onClick={ handleClick } className="logout-btn" />
                </div>
            </div>
            <hr />
            <ul className="list">
                { list }
            </ul>
        </div>
    )
}

export default UserMenu