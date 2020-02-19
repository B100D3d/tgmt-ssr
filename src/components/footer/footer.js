import React, {useEffect, useState} from 'react';

import './footer.sass';
import rggmu from './rggmu.webp';
import logo from './logo.webp';


const Footer = () => {

    const [diff, setDiff] = useState();

    useEffect(() => {
        const currentDate = new Date(); //сегодняшняя дата 
        const creatingDate = new Date(1952, 6, 16); //дата начала
        setDiff(Math.floor((currentDate - creatingDate) / (1000 * 60 * 60 * 24 * 365)));
    }, [])

    return (
        <div className="footer">
            <h1>Друзья ТГМТ</h1>
            <div className="friends-container" >
                <img src={rggmu} alt="rggmu" className="rggmu" />
            </div>
            <img src={logo} alt="logo" className="logo" />
                <span className="subtitle">{diff} лет успешной деятельности в сфере профессионального образования</span>
        </div >
    )
}

export default Footer;