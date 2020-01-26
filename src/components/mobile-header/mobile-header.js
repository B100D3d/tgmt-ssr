import React, {useContext} from 'react';
import {elastic as Menu} from 'react-burger-menu';

import {WeekContext} from '../../context';

import Search from '../header/search/search';

import './mobile-header.sass';
import logo from './logo.png';
import burger from './burger.svg';
import close from './cross.svg';


const styles = {
    bmMorphShape: {
        width: "45%",
        fill: "#2C2A2A"
    },
    bmMenu: {
        width: "95%",
        background: "#2C2A2A",
        padding: "10px",
        paddingTop: "0"
    },
    bmMenuWrap: {
        width: "105%"
    },
    bmBurgerButton: {
        position: 'absolute',
        width: '30px',
        height: '30px',
        right: '3%',
        top: '5px'
    },
    bmCrossButton: {
        position: 'absolute',
        width: '30px',
        height: '30px',
        right: '5px',
        top: '15px'
    },
    bmItemList: {
        width: "100%",
        left: "0"
    }
}


const MobileHeader = () => {

    const {date, weekNumber, even} = useContext(WeekContext)

    return (
        <>
            <header className="mobile-header">
                <Menu styles={styles} outerContainerId={"root"} pageWrapId={"wrap"} 
                    right noOverlay customBurgerIcon={ <img src={burger} /> }
                    customCrossIcon={ <img src={close} /> } disableAutoFocus >
                    <p className="week">
                        {date}
                        <br />
                        {weekNumber} {even} 
                    </p>
                    <Search />
                </Menu>
                <div className="header-top" id="wrap">
                    < div className="container" >
                        <img src={logo} alt="logo" />
                        <h2>ТУАПСИНСКИЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ТЕХНИКУМ</h2>
                        
                    </div>
                </div>
            </header>
        </>
    );
}

export default MobileHeader;