import React, { useEffect, useState, useRef, useMemo } from "react"
import { range, generateId, registerCSSColorProperty } from "utils"

import "./switch.sass"

const COLOR_NAME = `--switch-color-`
const COLORS = ["#B326FF", "#5F26FF", "#4106c9", "#29B6F6"]

const Switch = ({ names, title, values, initValue, isAdmin, onChange }) => {
    const checkedIndex = useMemo(() => values.indexOf(initValue), [values, initValue])
    const initColors = useMemo(() =>
        checkedIndex === 0 ? COLORS.slice(0, 2)
        : checkedIndex === 1 ? COLORS.slice(1, 3)
        : COLORS.slice(2, 4)
    , [checkedIndex])
    const [colors, setColors] = useState(initColors)
    const checkbox = useRef()
    const id = useMemo(generateId, [])

    const adminClass = useMemo(() => isAdmin ? "admin" : "", [isAdmin])

    useEffect(() => {
        range(2).forEach(i => {
            const name = `${ COLOR_NAME }${ i }`
            const initialValue = COLORS[i]
            registerCSSColorProperty(name, initialValue)
        })
    }, [])

    const handleClick = () => {
        const el = document.querySelector(`input[name = "check${ id }"]:checked`)
        const value = Number(el.value)

        const lastFirstColorIndex = isAdmin ? 3 : 2
        const newFirstColorIndex = (COLORS.indexOf(colors[0]) + 1) % lastFirstColorIndex
        setColors([
            COLORS[newFirstColorIndex],
            COLORS[newFirstColorIndex + 1]
        ])

        onChange(values[value])
    }

    return (
        <div className={`switch ${ adminClass }`} >
            <input type="radio" name={`check${ id }`} value="0" onClick={ handleClick }
                   defaultChecked={ checkedIndex === 0 } />
            <input type="radio" name={`check${ id }`} value="1" onClick={ handleClick }
                   defaultChecked={ checkedIndex === 1 }/>
            <input type="radio" name={`check${ id }`} value="2" onClick={ handleClick }
                   id="third-switch" />
            <div className="switch-checkbox"
                 ref={ checkbox }
                 data-first-name={names[0]}
                 data-second-name={names[1]}
                 data-third-name={names[2]}
                 style={{
                    "--switch-color-0": colors[0],
                    "--switch-color-1": colors[1]
                 }}
            />
            <span className="switch-title">{ title }</span>
        </div>
    )
}

export default Switch