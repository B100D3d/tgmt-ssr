import React, { useRef } from 'react';
import loadable from '@loadable/component'

const OpenButton = loadable(() => import('/components/open-button/open-button')) 

import s from './about.module.sass';
import tgmt from '/static/tgmt.webp';

import { t, text } from './text.js';

const About = () => {
    const aboutEl = useRef()

    const handleClick = el => {
        aboutEl.current.style.maxHeight = '5000px';
    
        el.currentTarget.style.display = 'none';
    }

    return (
        <>
            <div className={s.about} ref={ aboutEl }>
                <h2>
                    О техникуме
                </h2>
                <p>
                    <img src={ tgmt } alt="tgmt" />
                </p>
                <p>
                    <span>{ t }</span>
                    { text[0] }
                </p>
                { text.map((item, i) => {
                    if (i !== 0) 
                        return <p key={ i }>{ item }</p>                        
                })}
            </div>
            <OpenButton onClick={ handleClick } />
        </>
    );
}; 

export default About;