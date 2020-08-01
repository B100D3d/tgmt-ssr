import React, { useContext } from "react"

import "./user-menu.sass"
import { UserContext } from "context"
import logoutImg from "static/logout.svg"
import AdminList from "./admin-list/admin-list"
import StudentList from "./student-list/student-list"
import TeachersList from "./teacher-list/teacher-list"
import useLogout from "hooks/useLogout"
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

    const logout = useLogout()
    const { user } = useContext(UserContext)
    const list = LISTS[user.role]
    const role = getRole(user)

    return (
        <div className="user-menu">
            <div className="user-info">
                <div className="user-text">
                    <h3>{ user.name }</h3>
                    <p>{ role }</p>
                </div>
                <div className="logout-con">
                    <img src={ logoutImg } alt="logout" />
                    <button onClick={ logout } className="logout-btn" />
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