import React, { useContext, useMemo } from "react"
import { UserContext } from "context"

import useLogout from "hooks/useLogout"

import "./user-menu.sass"
import logoutImg from "static/logout.svg"
import { NavLink as Link } from "react-router-dom"

const ROUTE_TEXT = {
    "/user": "Рассписание",
    "/user/register": "Журнал",
    "/user/subjects": "Предметы",
    "/user/students": "Студенты",
    "/user/teachers": "Преподаватели",
    "/user/mailing": "Рассылка",
    "/user/settings": "Настройки",
}

const ROUTES = {
    "/user": "All",
    "/user/register": "All",
    "/user/subjects": ["Admin"],
    "/user/students": ["Admin"],
    "/user/teachers": ["Admin"],
    "/user/mailing": ["Admin"],
    "/user/settings": "All",
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
    const routes = useMemo(
        () =>
            Object.entries(ROUTES).map(([key, value]) => {
                if (value.includes(user.role) || value === "All") {
                    return key
                }
            }),
        [user]
    )
    const role = useMemo(() => getRole(user), [user])

    return (
        <div className="user-menu">
            <div className="user-info">
                <div className="user-text">
                    <h3>{user.name}</h3>
                    <p>{role}</p>
                </div>
                <div className="logout-con">
                    <img src={logoutImg} alt="logout" />
                    <button onClick={logout} className="logout-btn" />
                </div>
            </div>
            <hr />
            <ul className="list">
                {routes.map((route) => (
                    <li key={route}>
                        <Link
                            exact={route === "/user"}
                            activeClassName="active"
                            to={route}
                        >
                            {ROUTE_TEXT[route]}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserMenu
