import React from 'react';

import Search from '../search/search';
import './header-top.sass';
import eye from './eye.svg';
import student from './student.svg';

const HeaderTop = () => {
    return (
        <div className="header-top">
            <div className="container">
                <button className="contrast">
                    <img src={eye} alt="eye" className="eye" width='30px' height='30px' />
                    Версия для слабовидящих
                </button>
                <Search />
                <button className="login">
                    <img src={student} alt="student" className="student" />
                    Личный кабинет
                </button>
            </div>
        </div>
    );
}

export default HeaderTop; 