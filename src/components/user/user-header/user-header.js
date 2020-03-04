import React, { useContext, useState } from 'react';

import './user-header.sass';
import { WeekContext } from '../../../context';
import burger from './burger.svg';


const UserHeader = () => {

    const [isOpen, setOpen] = useState(true)

    const handleClick = () => {
        if (isOpen) {
            document.querySelector('.flex-container').classList.remove('open')
        } else {
            document.querySelector('.flex-container').classList.add('open')
        } 
        setOpen(!isOpen)
    }

    const {date, weekNumber, even} = useContext(WeekContext);
    return (
        <header className="user-header">
            <div className="burger-con">
                <img src={ burger } alt="burger" />
                <button className="burger-btn" onClick={ handleClick } />
            </div>
            <p className="week">
                { date }
                <br />
                { weekNumber } { even } 
            </p>
        </header>
    )
}

export default UserHeader;