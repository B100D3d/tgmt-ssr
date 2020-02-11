import React from 'react';
import { Link } from 'react-router-dom';

import './auth.sass';
import back from './previous.svg';
import RainbowButton from '../rainbow-button/rainbow-button';

import bublik from './bublik.webp';


const styles = {
    background: `url(${bublik})`,
    backgroundColor: '#000000',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto 100%'
}

const Auth = () => {
    return (
        <div className="auth-back" style={styles}>
            <div className="auth">
                <Link to="/">
                    <img src={back} alt="back" / >
                </Link>
                <h1 className="title">Авторизация</h1>
                <div className="input-container">
                    <div className="input-border">
                        <input type="text" className="input" placeholder="Логин" border='2' />
                    </div>
                    <div className="input-border">
                        <input type="password" className="input" placeholder="Пароль" />
                    </div>
                </div>
                <RainbowButton className="button-auth" interval={2500}>
                    Войти
                </RainbowButton>
            </div>
        </div>
    )
}

export default Auth;