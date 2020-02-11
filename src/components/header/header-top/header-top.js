import React from 'react';
import { Link } from 'react-router-dom';

import Search from '../../search/search';
import './header-top.sass';
import eye from './eye.svg';
import student from './student.svg';
import RainbowButton from '../../rainbow-button/rainbow-button';


const HeaderTop = () => {
    return (
        <div className="header-top">
            <div className="container">
                <button className="contrast">
                    <img src={eye} alt="eye" className="eye" width='30px' height='30px' />
                    Версия для слабовидящих
                </button>
                <Search />
                <Link to='/user'>
                    <RainbowButton className="login" interval={2000}>
                        <img src={student} alt="student" className="student" />
                        Личный кабинет
                    </RainbowButton>
                </Link>
            </div>
        </div>
    );
}

export default HeaderTop; 