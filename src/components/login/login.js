import React, { useRef, useContext, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import cogoToast from "cogo-toast"
import loadable from "@loadable/component"
import { login } from "services"
import { UserContext, FingerprintContext } from "context"

const RainbowButton = loadable(() =>
    import(
        /* webpackChunkName: "RainbowButton" */ "components/rainbow-button/rainbow-button"
    )
)

import back from "static/previous.svg"
import "./login.sass"
import CircleButton from "components/circle-button/circle-button"

const Login = () => {
    const history = useHistory()
    const { setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    const loginInput = useRef()
    const passwordInput = useRef()
    const background = useRef()

    useEffect(() => {
        const moveBg = (e) => {
            background.current.style.setProperty(
                "--x",
                `${-e.clientX / 10 - 200}px`
            )
            background.current.style.setProperty("--y", `${-e.clientY / 10}px`)
        }
        background.current.addEventListener("mousemove", moveBg)
        return () => background.current.removeEventListener("mousemove", moveBg)
    }, [])

    const handleClick = () => {
        const { hide } = cogoToast.loading("Загрузка...", {
            hideAfter: 0,
            position: "top-right",
        })

        login(
            loginInput.current.value,
            passwordInput.current.value,
            fingerprint
        )
            .then((user) => {
                hide()
                cogoToast.success("Данные успешно получены.", {
                    position: "top-right",
                })
                setUser(user)
                setError(false)
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    hide()
                    cogoToast.error("Неверный логин или пароль.", {
                        position: "top-right",
                    })
                }
            })
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleClick()
        }
    }

    return (
        <div className="auth-back" ref={background}>
            <div className="auth">
                <CircleButton img={back} onClick={history.goBack} />
                <h1 className="title">Авторизация</h1>
                <div className="input-container">
                    <div className="input-border">
                        <input
                            type="text"
                            ref={loginInput}
                            className="input"
                            placeholder="Логин"
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    <div className="input-border">
                        <input
                            type="password"
                            ref={passwordInput}
                            className="input"
                            placeholder="Пароль"
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                </div>
                <RainbowButton
                    onClick={handleClick}
                    className="button-auth"
                    interval={2000}
                >
                    Войти
                </RainbowButton>
            </div>
        </div>
    )
}

export default Login
