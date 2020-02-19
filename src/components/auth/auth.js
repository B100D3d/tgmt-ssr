import React, {useRef, useContext} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './auth.sass';
import back from './previous.svg';
import RainbowButton from '../rainbow-button/rainbow-button';
import { UserContext } from '../../context';

import bublik from './bublik.webp';


const styles = {
    background: `url(${bublik})`,
    backgroundColor: '#000000',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%'
}

const auth = async (login, password) => {
    const query = await axios.post('https://тгмт.рф/api/login', {
        query: `{
            login(login: "${login}", password: "${password}") {
                ... on Admin {
                    name
                    role
                    email
                }
            }
        }`
    }, {withCredentials: true});
    return query.data.data.login;
}




const Auth = () => {

    const {setUser, setError} = useContext(UserContext);

    const login = useRef()
    const password = useRef()

    const handleClick = () => {
        auth(login.current.value, password.current.value)
            .then(user => {
                setUser(user)
                setError(false)
            })
            .catch(error => {
                console.log(error.response)
                if (error.response.status === 403) {
                    document.querySelector('.login-error').classList.remove('hidden')
                }
            })
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            handleClick();
        }
    }

    return (
        <div className="auth-back" style={styles}>
            <div className="auth">
                <Link to="/">
                    <img src={back} alt="back" / >
                </Link>
                <h1 className="title">Авторизация</h1>
                <span className="login-error hidden">Неверный логин или пароль</span>
                <div className="input-container">
                    <div className="input-border">
                        <input type="text" ref={login} className="input" placeholder="Логин" onKeyPress={handleKeyPress} />
                    </div>
                    <div className="input-border">
                        <input type="password" ref={password} className="input" placeholder="Пароль" onKeyPress={handleKeyPress} />
                    </div>
                </div>
                <RainbowButton onClick={handleClick} className="button-auth" interval={2000}>
                    Войти
                </RainbowButton>
            </div>
        </div>
    )
}

export default Auth;