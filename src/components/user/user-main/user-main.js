import React, { useContext } from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { Route, Switch, useLocation, useHistory } from "react-router-dom"

import "./user-main.sass"
import Schedule from "./schedule/schedule"
import { UserContext } from "/context"
import Selector from "./selector/selector"
import Register from "./register/register"
import UsersList from "./users-list/users-list"

import back from "/static/previous.svg"
import NewUser from "./users-list/new-user/new-user";

const LINKS = [
    "/user/register",
    "/user/groups",
    "/user/students",
    "/user/teachers",
    "/user/settings",
    "/user"
]

const shouldBackRender = (path) => {
    return !LINKS.includes(path)
}

const UserMain = () => {

    const location = useLocation()
    const history = useHistory()
    const { user: { role } } = useContext(UserContext)

    const onBack = () => {
        history.goBack()
    }

    return (
        <div className="user-main">
            { shouldBackRender(location.pathname) && <img className="back" src={ back } alt="back" onClick={ onBack }/> }
            <TransitionGroup>
                <CSSTransition
                    key={ location.key }
                    timeout={ 1000 }
                    classNames="fade">
                    { role === "Student" ?
                        <Switch location={ location }>
                            <Route exact path="/user" component={ Schedule } />
                            <Route path="/user/register" component={ Register } />
                            <Route path="/user/settings" component={ Schedule } />
                        </Switch>
                    : role === "Admin" ?
                        <Switch location={ location }>
                            <Route exact path="/user/register" render={ () =>
                                <Selector type="year" title="Журнал"  /> }
                            />
                            <Route exact path="/user/register/:year" render={ () =>
                                <Selector type="group" title="Журнал"  /> }
                            />
                            <Route exact path="/user/register/:year/:group" render={ () =>
                                <Selector type="subject" title="Журнал"  /> }
                            />
                            <Route exact path="/user/register/:year/:group/:subject"
                                   component={ Register }
                            />

                            <Route exact path="/user/students" render={ () =>
                                <UsersList type="Student" /> }
                            />
                            <Route exact path="/user/students/new" render={ () =>
                                <NewUser type="Student" /> }
                            />
                            <Route exact path="/user/teachers" render={ () =>
                                <UsersList type="Teacher" /> }
                            />
                            <Route exact path="/user/teachers/new" render={ () =>
                                <NewUser type="Teacher" /> }
                            />

                            <Route exact path="/user" render={ () =>
                                <Selector type="year" title="Расписание"  /> }
                            />
                            <Route exact path="/user/:year" render={ () =>
                                <Selector type="group" title="Расписание" /> }
                            />
                            <Route exact path="/user/:year/:group" component={ Schedule } />
                        </Switch>
                    : 
                        <Switch location={ location }>
                            <Route exact path="/user" component={ Schedule } />
                        </Switch> }
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}


export default UserMain