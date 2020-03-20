import React, { useEffect, useState, useRef } from 'react';

import './switch.sass';


const COLOR_NAME = `--color-`
const COLORS = ["#B326FF", "#5F26FF", "#4106c9", "#29B6F6"]

const getNewState = (value, title) => {
    if (title === 'Неделя') {
        const v = value === 2 ? null : !value
        return { even: v }
    } else {
        const v = value === 2 ? null : value + 1
        return { subgroup: v }
    }
}

const generateId = (len = 2) => {
    const alfs = "abcdefghijklmnopqrstuvwxyz1234567890";
    let id = "";
    for (let i = 0; i < len; i++) {
        id += alfs[Math.floor(Math.random() * alfs.length)]
    }
    return id;
}

const Switch = ({ val0, val1, title, isAdmin, state, onClick }) => {
    const [colors, setColors] = useState(COLORS.slice(0, 2))
    const checkbox = useRef()
    const id = useRef(generateId())
    const adminClass = isAdmin ? 'admin' : ''

    useEffect(() => {
        [0, 1].map(i => {
            const name = `${ COLOR_NAME }${ i }`
            const initialValue = COLORS[i]
            try{
                CSS.registerProperty({
                    name,
                    initialValue,
                    syntax: '<color>',
                    inherits: false
                })
            } catch(err){}
            
        })
    }, [])

    useEffect(() => {
        checkbox.current.setAttribute('data-val0', val0)
        checkbox.current.setAttribute('data-val1', val1)

    }, []);

    const handleClick = () => {
        const el = document.querySelector(`input[name = "check${ id.current }"]:checked`)
        const value = +el.value
        const newState = getNewState(value, title)
        const [switchState, setSwitch] = state
        setSwitch({ ...switchState, ...newState })
        setColors([COLORS[value], COLORS[value+1]])
        onClick()
    }

    return (
        <div className={`switch ${ adminClass }`} >
            <input type='radio' name={`check${ id.current }`} value='0' onClick={ handleClick } defaultChecked />
            <input type='radio' name={`check${ id.current }`} value='1' onClick={ handleClick } />
            <input type='radio' name={`check${ id.current }`} id='third-pos' value='2' onClick={ handleClick } />
            <div className='checkbox-area'>
                <div className='checkbox-circle' ref={ checkbox } style={{
                    '--color-0': colors[0],
                    '--color-1': colors[1]
                }} />
            </div>
            <span className='switch-title'>{ title }</span>
        </div>
    )
}

export default Switch;