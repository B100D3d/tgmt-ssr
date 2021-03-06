import React, { useContext, useMemo } from "react"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import { Route, Switch, useLocation, useHistory } from "react-router-dom"
import { UserContext } from "context"

import Schedule from "./schedule/schedule"
import Selector from "./selector/selector"
import Register from "./register/register"
import UsersList from "./users-list/users-list"
import UserInfo from "./users-list/user-info/user-info"
import GroupInfo from "./group-info/group-info"
import SubjectList from "./subject-list/subject-list"
import SubjectInfo from "./subject-list/subject-info/subject-info"
import Settings from "./settings/settings"
import Mailing from "./mailing/mailing"
import CircleButton from "components/circle-button/circle-button"

import "./user-main.sass"
import back from "static/previous.svg"

const LINKS = [
    "/user/register",
    "/user/groups",
    "/user/students",
    "/user/teachers",
    "/user/subjects",
    "/user/mailing",
    "/user/settings",
    "/user",
]

const shouldBackRender = (path) => !LINKS.includes(path)

const UserMain = () => {
    const location = useLocation()
    const history = useHistory()
    const {
        user: { role },
    } = useContext(UserContext)
    const showBack = useMemo(() => shouldBackRender(location.pathname), [
        location,
    ])

    return (
        <div className="user-main">
            <CSSTransition
                in={showBack}
                classNames="fade"
                timeout={500}
                unmountOnExit
            >
                <CircleButton img={back} onClick={history.goBack} />
            </CSSTransition>
            <TransitionGroup>
                <CSSTransition
                    key={location.key}
                    timeout={1000}
                    classNames="fade"
                >
                    {role === "Student" ? (
                        <Switch location={location}>
                            <Route exact path="/user" component={Schedule} />
                            <Route path="/user/register" component={Register} />
                            <Route
                                exact
                                path="/user/settings"
                                component={Settings}
                            />
                        </Switch>
                    ) : role === "Admin" ? (
                        <Switch location={location}>
                            <Route
                                exact
                                path="/user/register"
                                render={() => (
                                    <Selector type="year" title="Журнал" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/register/:year"
                                render={() => (
                                    <Selector type="group" title="Журнал" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/register/:year/:group"
                                render={() => (
                                    <Selector type="subject" title="Журнал" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/register/:year/:group/:subject"
                                component={Register}
                            />

                            <Route
                                exact
                                path="/user/students"
                                render={() => <UsersList type="Student" />}
                            />
                            <Route
                                exact
                                path="/user/students/new"
                                render={() => <UserInfo type="Student" />}
                            />
                            <Route
                                exact
                                path="/user/students/:id"
                                render={() => <UserInfo type="Student" />}
                            />
                            <Route
                                exact
                                path="/user/teachers"
                                render={() => <UsersList type="Teacher" />}
                            />
                            <Route
                                exact
                                path="/user/teachers/new"
                                render={() => <UserInfo type="Teacher" />}
                            />
                            <Route
                                exact
                                path="/user/teachers/:id"
                                render={() => <UserInfo type="Teacher" />}
                            />

                            <Route
                                exact
                                path="/user/subjects"
                                component={SubjectList}
                            />
                            <Route
                                exact
                                path="/user/subjects/new"
                                component={SubjectInfo}
                            />
                            <Route
                                exact
                                path="/user/subjects/:id"
                                component={SubjectInfo}
                            />

                            <Route
                                exact
                                path="/user/groups"
                                render={() => (
                                    <Selector
                                        type="group"
                                        title="Группы"
                                        deletable
                                    />
                                )}
                            />
                            <Route
                                exact
                                path="/user/groups/new"
                                component={GroupInfo}
                            />
                            <Route
                                exact
                                path="/user/groups/:id"
                                component={GroupInfo}
                            />

                            <Route
                                exact
                                path="/user/settings"
                                component={Settings}
                            />

                            <Route
                                exact
                                path="/user/mailing"
                                component={Mailing}
                            />

                            <Route
                                exact
                                path="/user"
                                render={() => (
                                    <Selector type="year" title="Расписание" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/:year"
                                render={() => (
                                    <Selector type="group" title="Расписание" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/:year/:group"
                                component={Schedule}
                            />
                        </Switch>
                    ) : (
                        <Switch location={location}>
                            <Route
                                exact
                                path="/user/register"
                                render={() => (
                                    <Selector type="year" title="Журнал" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/register/:year"
                                render={() => (
                                    <Selector type="group" title="Журнал" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/register/:year/:group"
                                render={() => (
                                    <Selector type="subject" title="Журнал" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/register/:year/:group/:subject"
                                component={Register}
                            />

                            <Route
                                exact
                                path="/user/settings"
                                component={Settings}
                            />

                            <Route
                                exact
                                path="/user"
                                render={() => (
                                    <Selector type="year" title="Расписание" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/:year"
                                render={() => (
                                    <Selector type="group" title="Расписание" />
                                )}
                            />
                            <Route
                                exact
                                path="/user/:year/:group"
                                component={Schedule}
                            />
                        </Switch>
                    )}
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}

export default UserMain
