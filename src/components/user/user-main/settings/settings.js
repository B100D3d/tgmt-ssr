import React, {useContext, useEffect, useRef, useState} from "react"

import "./settings.sass"
import { FingerprintContext, UserContext } from "context"
import { changeUserInfo, clearFingerprint } from "api"
import cogoToast from "cogo-toast";
import { useHistory } from "react-router-dom"
import logout from "utils/logout"


const Settings = () => {
    const { user, setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)
    const [login, setLogin] = useState(user.login)
    const [email, setEmail] = useState(user.email)
    const [newPassword, setNewPassword] = useState("")
    const [password, setPassword] = useState("")
    const loginRef = useRef()
    const emailRef = useRef()
    const newPasswordRef = useRef()
    const passwordRef = useRef()
    const history = useHistory()

    useEffect(() => {
        const isValid = (login !== user.login || email !== user.email || newPassword)
            && (loginRef.current.checkValidity() && emailRef.current.checkValidity()
                && newPasswordRef.current.checkValidity())
        setPasswordVisibility(isValid)
    }, [login, email, newPassword])

    useEffect(() => {
        const isValid = passwordRef.current.checkValidity()
        setSaveBtnVisibility(isValid)
    }, [password])

    const handleLogin = () => setLogin(loginRef.current.value)
    const handleEmail = () => setEmail(emailRef.current.value)
    const handleNewPassword = () => setNewPassword(newPasswordRef.current.value)
    const handlePassword = () => setPassword(passwordRef.current.value)

    const handleSave = () => {
        const { hide } = cogoToast.loading("Загрузка...", { hideAfter: 0, position: "top-right" })
        changeUserInfo(fingerprint, password, email, login, newPassword)
            .then(() => {
                hide()
                cogoToast.success("Настройки изменены.", { position: "top-right" })
                setUser({ ...user, login, email })
            })
            .catch((error) => {
                hide()
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }

    const handleExit = () => {
        clearFingerprint(fingerprint)
            .then(() => {
                history.push("/")
            })
            .catch((error) => {
                cogoToast.error("Ошибка.", { position: "top-right" })
                if (error.response.status === 401 || error.response.status === 403) {
                    logout(history, setUser, setError)
                }
            })
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>
                    { user.name }
                    { user.role === "Student" && <span>{user.group?.name}</span> }
                </h1>
                <button className="exit" onClick={ handleExit }>Выйти со всех устройств</button>
            </div>
            <div className="settings">
                <input className="login" type="text" placeholder="Логин" autoComplete="off"
                       required ref={ loginRef } onChange={ handleLogin } value={ login } data-lpignore="true" />
                <input className="email" type="email" placeholder="Email" autoComplete="off"
                       required ref={ emailRef } onChange={ handleEmail } value={ email } data-lpignore="true" />
                <input className="new-password" placeholder="Новый пароль" autoComplete="new-password"
                       ref={ newPasswordRef } onChange={ handleNewPassword } data-lpignore="true" />
            </div>
            <div className="submit">
                <input type="password" placeholder="Подтвердите паролем" autoComplete="new-password"
                       required ref={ passwordRef } onChange={ handlePassword } data-lpignore="true" />
                <button className="save-button" onClick={ handleSave } >Сохранить</button>
            </div>
        </div>
    )
}

export default Settings

const setSaveBtnVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".save-button").classList.add("visible")
        : document.querySelector(".save-button").classList.remove("visible")
}
const setPasswordVisibility = (isVisible) => {
    isVisible
        ? document.querySelector(".submit input").classList.add("visible")
        : document.querySelector(".submit input").classList.remove("visible")
}