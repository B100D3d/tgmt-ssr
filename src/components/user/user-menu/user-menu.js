import React, { useContext, useMemo } from "react"
import { UserContext } from "context"
import { NavLink as Link } from "react-router-dom"
import CircleButton from "components/circle-button/circle-button"
import useLogout from "hooks/useLogout"

import "./user-menu.sass"
import logoutImg from "static/logout.svg"

const ROUTES = {
    "/user": {
        roles: "All",
        text: "Рассписание",
    },
    "/user/register": {
        roles: "All",
        text: "Журнал",
    },
    "/user/groups": {
        roles: ["Admin"],
        text: "Группы",
    },
    "/user/subjects": {
        roles: ["Admin"],
        text: "Предметы",
    },
    "/user/students": {
        roles: ["Admin"],
        text: "Студенты",
    },
    "/user/teachers": {
        roles: ["Admin"],
        text: "Преподаватели",
    },
    "/user/mailing": {
        roles: ["Admin"],
        text: "Рассылка",
    },
    "/user/settings": {
        roles: "All",
        text: "Настройки",
    },
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
            Object.entries(ROUTES).map(([route, { roles }]) => {
                if (roles.includes(user.role) || roles === "All") {
                    return route
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
                <CircleButton img={logoutImg} onClick={logout} />
            </div>
            <hr />
            <ul className="list">
                {routes.map((route) => (
                    <li key={route}>
                        <Link
                            exact={route === "/user"}
                            isActive={(match, location) => {
                                if (match) {
                                    return match
                                }
                                if (route === "/user") {
                                    return location.pathname.match(
                                        /^(\/user\/\d)/
                                    )
                                }
                            }}
                            activeClassName="active"
                            to={route}
                        >
                            {ROUTES[route].text}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserMenu
