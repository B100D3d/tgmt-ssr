import React from 'react';

import './about.sass';
import tgmt from './tgmt.png';

import {t, text} from './text.js';


const About = () => {
    return (
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
    
    );
}; 

export default About;