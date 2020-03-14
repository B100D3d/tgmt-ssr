import React, { useEffect, useState } from 'react';

import './switch.sass';


const COLOR_NAME = `--color-`
const COLORS = ["#B326FF", "#5F26FF", "#4106c9", "#29B6F6"]


const Switch = ({ val0, val1 }) => {
    const [colors, setColors] = useState(COLORS.slice(0, 2))

    useEffect(() => {
        [0, 1].map(i => {
            const name = `${ COLOR_NAME }${ i }`
            const initialValue = COLORS[i]
            CSS.registerProperty({
                name,
                initialValue,
                syntax: '<color>',
                inherits: false
            })
        })
    }, [])

    useEffect(() => {
        document.querySelector('.switch .checkbox-area .checkbox-circle').setAttribute('data-val0', val0)
        document.querySelector('.switch .checkbox-area .checkbox-circle').setAttribute('data-val1', val1)

    }, []);

    const handleClick = () => {
        const el = document.querySelector('input[name = "check"]:checked')
        const value = +el.value

        setColors([COLORS[value], COLORS[value+1]])
    }

    return (
        <div className='switch admin'>
            <input type='radio' name='check' value='0' onClick={ handleClick } defaultChecked />
            <input type='radio' name='check' value='1' onClick={ handleClick } />
            <input type='radio' name='check' id='third-pos' value='2' onClick={ handleClick } />
            <div className='checkbox-area'>
                <div className='checkbox-circle' data-name='' style={{
                    '--color-0': colors[0],
                    '--color-1': colors[1]
                }} />
            </div>
        </div>
    )
}

export default Switch;