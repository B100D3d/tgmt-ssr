import React from 'react';

import logo from './logo.png';
import './header-mid.sass';



const HeaderMid = () => {
    return (
        <div className="header-mid">
            <img src={logo}
            alt="logo" className="logo" />
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