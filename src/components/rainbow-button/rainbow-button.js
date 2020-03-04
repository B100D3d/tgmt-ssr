import React from 'react';

import useRainbow from '../../hooks/useRainbow.hook';

const RainbowButton = ({ className, interval, children, onClick }) => {

    const colors = useRainbow(interval);
    const colorKeys = Object.keys(colors);
        
    return (
        <button 
            className={ className }
            onClick={ onClick }
            style={{
                ...colors,
                background: `
                    radial-gradient(
                        circle at top left, 
                        var(${colorKeys[0]}),
                        var(${colorKeys[1]}),
                        var(${colorKeys[2]})
                    )
                `,
                transition: `
                ${colorKeys[0]} ${interval+300}ms linear,
                ${colorKeys[1]} ${interval+300}ms linear,
                ${colorKeys[2]} ${interval+300}ms linear,
                box-shadow .3s ease
                `
            }}
        >
            { children }
        </button>
    )
    
}
    
export default RainbowButton;