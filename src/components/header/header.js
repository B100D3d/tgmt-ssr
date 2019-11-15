import React from 'react';

import HeaderTop from './header-top/header-top';
import HeaderMenu from './header-menu/header-menu';
import HeaderMid from './header-mid/header-mid';
import SecondMenu from './second-menu/second-menu';

import './header.sass';

const Header = () => {
    return (
        <header className="main-header">
            <HeaderTop />
            <HeaderMenu />
            <HeaderMid />
            <hr />
            <SecondMenu /> 
        </header>
    );
};

export default Header;