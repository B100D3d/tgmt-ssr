import React from 'react';

import './mobile-header.sass';
import logo from './logo.png';

const MobileHeader = () => {
    return (
        <header className="mobile-header">
            <div className="header-top">
                <div className="container">
                    <img src={logo} alt="logo" />
                    <h2>ТУАПСИНСКИЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ТЕХНИКУМ</h2>
                    <button className="burger">Тут</button>
                </div>
            </div>
        </header>
    );
}

export default MobileHeader;