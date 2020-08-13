import React, { useCallback, useEffect, useMemo } from "react"
import { CSSTransition } from "react-transition-group"
import useCookie from "hooks/useCookie"
import loadable from "@loadable/component"

const RocketAnimation = loadable(() =>
    import(
        /* webpackChunkName: "RocketAnimation" */ "components/about-app/rocket-animation/rocket-animation"
    )
)

import "./about-app.sass"
import close from "static/cross.svg"

const noScroll = () => window.scrollTo(0, 0)

const AboutApp = () => {
    const [cookie, setCookie] = useCookie("showAboutModal")
    const showAboutApp = useMemo(
        () => cookie?.showAboutModal !== "true" && cookie !== null,
        [cookie]
    )

    const handleModal = useCallback(
        (show) => setCookie("showAboutModal", show),
        []
    )

    useEffect(() => {
        if (showAboutApp) window.addEventListener("scroll", noScroll)
        else window.removeEventListener("scroll", noScroll)
    }, [showAboutApp])

    return (
        <>
            <CSSTransition
                in={showAboutApp}
                timeout={500}
                classNames="fade"
                unmountOnExit
            >
                <div className="about-app-container">
                    <div className="about-app">
                        <img
                            onClick={() => handleModal(true)}
                            className="close"
                            src={close}
                        />
                        <h1>Данный сайт является дипломной работой для ТГМТ</h1>
                        <span>
                            Главная разработка — личный кабинет пользователя. Вы
                            можете протестировать его с помощью тестового
                            аккаунта с ролью администратора, который не
                            производит мутацию базы данных.
                        </span>
                        <span className="data-title">Данные для входа:</span>
                        <span>
                            Логин: <span className="login-data">test</span>
                        </span>
                        <span>
                            Пароль: <span className="login-data">test</span>
                        </span>
                        <span>
                            Код работы открыт, ознакомиться с ним вы можете
                            здесь:
                            <br />
                            <a
                                href="https://github.com/B100D3d/tgmt-ssr"
                                target="_blank"
                            >
                                https://github.com/B100D3d/tgmt-ssr
                            </a>
                        </span>
                        <RocketAnimation />
                    </div>
                </div>
            </CSSTransition>
            <CSSTransition
                in={!showAboutApp}
                timeout={500}
                classNames="fade"
                unmountOnExit
            >
                <button
                    onClick={() => handleModal(false)}
                    className="show-modal-button"
                />
            </CSSTransition>
        </>
    )
}

export default AboutApp
