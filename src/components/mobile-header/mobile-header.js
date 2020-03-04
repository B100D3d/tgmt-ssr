import React from 'react';

import './mobile-header.sass';
import logo from './logo.webp';
import BurgerMenu from '../burger-menu/burger-menu';


const MobileHeader = () => {

    return (
        <>              
            <header className="mobile-header">
                <BurgerMenu />
                <div className="header-top">
                    <img src={ logo } alt="logo" />
                    <h2>ТУАПСИНСКИЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ТЕХНИКУМ</h2>
                </div>
            </header>
        </>
    );
}

export default MobileHeader;