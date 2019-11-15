import React from 'react';

import './open-button.sass';
import open from './open.svg';


const handleClick = el => {
    document.querySelector('.about')
        .style.maxHeight = '5000px';

    el.currentTarget.style.display = 'none';
}


const OpenButton = () => {
    return (
        <div className="open-container">
            <button className="open" onClick={handleClick}>
                <img src={open} />
            </button>
        </div>
    );
}

export default OpenButton;