import React from 'react';
import { Link } from 'react-router-dom';

import logo from './logo.png';
import './header-mid.sass';


const HeaderMid = () => {
    return (
        <div className="header-mid">
            <Link to='/'>
                <img src={logo}
                alt="logo" className="logo" />
            </Link>
            <p>
                ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ПРОФЕССИОНАЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ 
                КРАСНОДАРСКОГО КРАЯ
                <br />
                "ТУАПСИНСКИЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ТЕХНИКУМ"
            </p>
        </div>
    );
};

export default HeaderMid;