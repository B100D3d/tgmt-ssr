import React, { useEffect, useState, useRef, useContext } from "react"
import { getResources } from "api"
import OpenButton from "components/open-button/open-button"

import { InitialDataContext } from "context"

import "./resources.sass"


const Resources = () => {

    const data = useContext(InitialDataContext)

    const [res, setRes] = useState(data.resources || [])
    const resRef = useRef()

    useEffect(() => {
        !data.resources && getResources().then(data => setRes(data))
    }, [])

    const handleClick = el => {
        resRef.current.style.maxHeight = "5000px"
    
        el.currentTarget.style.display = "none"
    }

    return (
        <>
            <div className="resources" ref={ resRef }>
                <h1>Полезные ресурсы</h1>
                <ul>
                    {res.map((data, key) => {
                        return (
                            <li key={ key }>
                                <a href={ data.url } target="_blank" 
                                                rel="noopener noreferrer">
                                    <img src={ `https://тгмт.рф/img/${ data.img }` }
                                        alt="Полезные ресурсы" />
                                </a>
                                <div className="text-container">
                                    <p>{ data.text }</p> 
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <OpenButton onClick={ handleClick } />
        </>
    )
}

export default Resources
