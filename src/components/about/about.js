import React from 'react';

import './about.sass';
import tgmt from './tgmt.webp';
import OpenButton from '../open-button/open-button';

import {t, text} from './text.js';


const handleClick = el => {
    document.querySelector('.about')
    .style.maxHeight = '5000px';

    el.currentTarget.style.display = 'none';
}

const About = () => {
    return (
        <>
            <div className="about">
                <h2>
                    О техникуме
                </h2>
                <p>
                    <img src={tgmt} alt="tgmt" />
                </p>
                <p>
                    <span>{t}</span>
                    {text[0]}
                </p>
                {text.map((item, i) => {
                    if (i !== 0) 
                        return <p key={i}>{item}</p>                        
                })}
            </div>
            <OpenButton onClick={handleClick} />
        </>
    );
}; 

export default About;