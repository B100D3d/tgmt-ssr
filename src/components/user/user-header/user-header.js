import React, {useContext} from 'react';

import './user-header.sass';
import { WeekContext } from '../../../context';
import burger from './burger.svg';


const UserHeader = () => {

    const {date, weekNumber, even} = useContext(WeekContext);
    return (
        <header className="user-header">
            <div className="burger-con">
                <img src={burger} alt="burger" />
                <button className="burger-btn" />
            </div>
            <p className="week">
                {date}
                <br />
                {weekNumber} {even} 
            </p>
        </header>
    )
}

export default UserHeader;