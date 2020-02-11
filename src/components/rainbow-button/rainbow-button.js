import React from 'react';

import useRainbow from './useRainbow.hook';

const RainbowButton = ({className, interval, children}) => {

    const colors = useRainbow(interval);
    const colorKeys = Object.keys(colors);
        
    return (
        <button 
            className={className}
            style={{
                ...colors,
                background: `
                    radial-gradient(
                        circle at top left, 
                        var(${colorKeys[2]}),
                        var(${colorKeys[1]}),
                        var(${colorKeys[0]})
                    )
                `,
                transition: `
                ${colorKeys[2]} ${interval+300}ms linear,
                ${colorKeys[1]} ${interval+300}ms linear,
                ${colorKeys[0]} ${interval+300}ms linear
                `
            }}
        >
            {children}
        </button>
    )
    
}
    
export default RainbowButton;