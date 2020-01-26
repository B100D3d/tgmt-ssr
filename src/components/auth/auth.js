import React from 'react';

import './auth.sass';


const Auth = () => {
    return (
        <div className="auth-back">
            <div className="auth">
                <h1 className="title">Авторизация</h1>
                <div className="input-container">
                    <div className="input-border">
                        <input type="text" className="input" placeholder="Логин" border='2' />
                    </div>
                    <div className="input-border">
                        <input type="password" className="input" placeholder="Пароль" />
                    </div>
                </div>
                <button className="button-auth">Войти</button>
            </div>
        </div>
    )
}

export default Auth;