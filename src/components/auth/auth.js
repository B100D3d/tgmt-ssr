import React, { useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import loadable from '@loadable/component';
import cogoToast from 'cogo-toast'

import { UserContext, FingerprintContext } from '/context';

const RainbowButton = loadable(() => import('/components/rainbow-button/rainbow-button')) 

import bublik from '/static/bublik.webp';
import back from '/static/previous.svg';

import './auth.sass';

const styles = {
    background: `url(${ bublik })`,
    backgroundColor: '#000000',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%'
}

const auth = async (login, password, fingerprint) => {
    const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3002"
    const query = await axios.post(`${url}/api/login`, {
        query: `{
            login(login: "${ login }", password: "${ password }") {
                ...on Admin {
                    name
                    role
                    email
                    groups {
                        id
                        name
                        year
                    }
                }
                ...on Teacher {
                    name
                    role
                    email
                    groups {
                        id
                        name
                        year
                        subjects {
                            id
                        }
                    }
                    subjects {
                        id
                        name
                    }
                }
                ...on Student {
                    name
                    role
                    email
                    group {
                        id
                        name
                        year
                    }
                    schedule {
                        subject {
                            id
                            name
                            teacher
                        }
                        weekday
                        classNumber
                    }
                }
            }
        }`,
        fingerprint
    }, { withCredentials: true });
    return query.data.data.login;
}




const Auth = () => {

    const { setUser, setError } = useContext(UserContext);
    const fingerprint = useContext(FingerprintContext)

    const login = useRef()
    const password = useRef()

    const handleClick = () => {
        const { hide } = cogoToast.loading('Загрузка...', { hideAfter: 0, position: 'top-right' })

        auth(login.current.value, password.current.value, fingerprint)
            .then(user => {
                hide()
                cogoToast.success('Данные успешно получены.', { position: 'top-right' })
                setUser(user)
                setError(false)
            })
            .catch(error => {
                if (error.response.status === 403) {
                    hide()
                    cogoToast.error('Неверный логин или пароль.', { position: 'top-right' })
                }
            })
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            handleClick();
        }
    }

    return (
        <div className="auth-back" style={ styles }>
            <div className="auth">
                <Link to="/">
                    <img src={ back } alt="back" />
                </Link>
                <h1 className="title">Авторизация</h1>
                <div className="input-container">
                    <div className="input-border">
                        <input type="text" ref={ login } className="input" placeholder="Логин" 
                            onKeyPress={ handleKeyPress } />
                    </div>
                    <div className="input-border">
                        <input type="password" ref={ password } className="input" placeholder="Пароль" 
                            onKeyPress={ handleKeyPress } />
                    </div>
                </div>
                <RainbowButton onClick={ handleClick } className="button-auth" interval={ 2000 }>
                    Войти
                </RainbowButton>
            </div>
        </div>
    )
}

export default Auth;