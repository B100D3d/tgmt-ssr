import React, { useContext } from 'react';
import { elastic as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

import { WeekContext } from '../../context';

import Search from '../search/search';

import './burger-menu.sass';
import logo from './logo.webp';
import burger from './burger.svg';
import close from './cross.svg';
import student from '../header/header-top/student.svg';
import RainbowButton from '../rainbow-button/rainbow-button';


const styles = {
    bmMorphShape: {
        width: "42%",
        fill: "#2C2A2A",
        left: "-5px"
    },
    bmMenu: {
        width: "62%",
        background: "#2C2A2A",
        padding: "0",
        paddingTop: "0",
        right: "-5px"
    },
    bmMenuWrap: {
        transform: "translate3d(101%, 0px, 0px)",
        width: "100%"
    },
    bmBurgerButton: {
        position: 'absolute',
        width: '30px',
        height: '30px',
        right: '3%',
        top: '5px',
        outline: 'none'
    },
    bmCrossButton: {
        position: 'absolute',
        width: '30px',
        height: '30px',
        right: '15px',
        top: '20px',
        outline: 'none'
    },
    bmItemList: {
        width: "163%",
        left: "-63%"
    }
}


const handleClick = (state) => {
    if (state.isOpen) {
        document.body.setAttribute('style', 'overflow: hidden; position: fixed;')
    } else {
        document.body.setAttribute('style', 'overflow: visible; position: static');
        document.querySelector('.bm-menu-wrap').style.transform = 'translate3d(101%, 0px, 0px)'
    }
}


const BurgerMenu = () => {

    const { date, weekNumber, even } = useContext(WeekContext)

    return (
        <>     
            <Menu styles={ styles } outerContainerId={ "root" } pageWrapId={ "wrap" } 
                    right customBurgerIcon={ <img src={ burger } alt="burger" /> }
                    customCrossIcon={ <img src={ close } alt="close" /> } disableAutoFocus 
                    onStateChange={ handleClick }>
                    <div>
                        <div className="title-container">
                            <img className="menu-logo" src={ logo } alt="logo" />
                            <p className="menu-title">ТГМТ</p>
                        </div>
                    </div>
                    <div>
                        <div className="week-and-login-container">
                            <div>
                                <p className="week-date">
                                    { date }
                                </p>
                                <p className="week-number">
                                    { weekNumber } { even } 
                                </p>
                            </div>
                            <Link to='/user' onClick={ handleClick }>
                                <RainbowButton className="login" interval={ 2000 }>
                                    <img src={ student } alt="student" className="student" />
                                    Личный кабинет
                                </RainbowButton>
                            </Link>
                            <Search />
                        </div>
                    </div>
            </Menu>         
        </>
    );
}

export default BurgerMenu;