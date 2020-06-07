import React, { useEffect, useState, useRef, useContext, useMemo } from "react"

import "./switch.sass"
import { WeekContext } from "context"


const COLOR_NAME = `--switch-color-`
const COLORS = ["#B326FF", "#5F26FF", "#4106c9", "#29B6F6"]

const getNewState = (value, title) => {
    if (title === "Неделя") {
        const v = value === 2 ? null : !value
        return { even: v }
    } else {
        const v = value === 2 ? null : value + 1
        return { subgroup: v }
    }
}

const generateId = (len = 5) => {
    const alfs = "abcdefghijklmnopqrstuvwxyz1234567890"
    let id = ""
    for (let i = 0; i < len; i++) {
        id += alfs[Math.floor(Math.random() * alfs.length)]
    }
    return id
}

const Switch = ({ firstName, secondName, title, isAdmin, onChange }) => {
    const { even } = useContext(WeekContext)
    const [switchState, setSwitch] = useState({ even, subgroup: 1 })
    const initColors = !even && title === "Неделя" ? COLORS.slice(1, 3) : COLORS.slice(0, 2)
    const [colors, setColors] = useState(initColors)
    const checkbox = useRef()
    const id = useMemo(generateId, [])

    const adminClass = isAdmin ? "admin" : ""

    useEffect(() => {
        [0, 1].map(i => {
            const name = `${ COLOR_NAME }${ i }`
            const initialValue = COLORS[i]
            try {
                CSS.registerProperty({
                    name,
                    initialValue,
                    syntax: '<color>',
                    inherits: false
                })
            } catch(err) {}
        })
    }, [])

    useEffect(() => {
        checkbox.current.setAttribute("data-val0", firstName)
        checkbox.current.setAttribute("data-val1", secondName)
    }, [])

    useEffect(() => {
        isAdmin && onChange(switchState)
    }, [])

    const handleClick = () => {
        const el = document.querySelector(`input[name = "check${ id }"]:checked`)
        const value = +el.value

        setColors([COLORS[value], COLORS[value+1]])

        const newState = { ...switchState, ...getNewState(value, title) }
        setSwitch(newState)
        onChange(newState)
    }

    return (
        <div className={`switch ${ adminClass }`} >
            <input type="radio" name={`check${ id }`} value="0" onClick={ handleClick }
                   defaultChecked={ even || title === "Подгруппа" } />
            <input type="radio" name={`check${ id }`} value="1" onClick={ handleClick }
                   defaultChecked={ !even && title === "Неделя" }/>
            <input type="radio" name={`check${ id }`} id="third-pos" value="2" onClick={ handleClick } />
            <div className="checkbox-area">
                <div className="checkbox-circle" ref={ checkbox } style={{
                    "--switch-color-0": colors[0],
                    "--switch-color-1": colors[1]
                }} />
            </div>
            <span className="switch-title">{ title }</span>
        </div>
    )
}

export default Switch