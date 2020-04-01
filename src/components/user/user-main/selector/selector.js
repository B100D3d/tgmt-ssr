import React, { useContext } from 'react'

import s from './selector.module.sass'
import useGradient from '/hooks/useGradient.hook'
import { UserContext } from '/context'
import { Link, useParams, useLocation } from 'react-router-dom'


const noDeg = ({ deg, ...rest }) => rest

const getCSSProperties = (gradient) => {
    const colors = {}
    
    for (const name in noDeg(gradient)) {
        colors[name] = gradient[name].color
    }
    return colors
}


const Selector = ({ type }) => {
    const params = useParams()
    const { user } = useContext(UserContext)
    const years = new Set(user.groups.map(({ year }) => year).sort((a, b) => a - b))
    const entities = type === "group" 
        ? user.groups.filter((group) => group.year == params.year) 
        : Array.from(years)

    return (
        <div className={ s.selector }>
            <h1>{ type === 'group' ? 'Выбор группы' : 'Выбор курса' }</h1>
            <div className={ s.items }>
                { entities.map((e, key) => {
                    return (<Item key={ key } name={ e.name || e } id={ e.id || e } />) 
                })}
            </div>
        </div>
        
    )
}

const Item = ({ name, id }) => {
    const [gradient, setHover] = useGradient(useGradient)
    const CSSProperties = getCSSProperties(gradient)
    const colors = Object.values(noDeg(gradient))
    const colorKeys = Object.keys(noDeg(gradient))
    const location = useLocation()
    
    const styles = {
        ...CSSProperties,
        transition: `
            ${ colorKeys[0] } .5s linear,
            ${ colorKeys[1] } .5s linear,
            ${ colorKeys[2] } .5s linear`,
        background: `
            linear-gradient(
                ${ gradient.deg },
                var(${ colorKeys[0] }) ${ colors[0].percent },
                var(${ colorKeys[1] }) ${ colors[1].percent },
                var(${ colorKeys[2] }) ${ colors[2].percent }
            )`
    }

    const handleMouseOver = () => {
        setHover(true)
    }
    const handleMouseOut = () => setHover(false)


    return (
        <Link to={ `${ location.pathname }/${ id }` }>
            <div className={ s.item } style={ styles } 
                onMouseOver={ handleMouseOver } onMouseOut={ handleMouseOut }>
                <p>{ name }</p>
            </div>
        </Link>
    )
}

export default Selector