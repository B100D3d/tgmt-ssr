import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import loadable from '@loadable/component'

const OpenButton = loadable(() => import('/components/open-button/open-button')) 

import './resources.sass';


const getResources = async () => {
    const query = await axios.post('https://тгмт.рф/api/mainPage', {
        query: `{
            resources {
                img
                text
                url
            }
        }`
    });
    return query.data.data.resources;
}

const Resources = () => {

    const [res, setRes] = useState([])
    const resRef = useRef()

    useEffect(() => {
        getResources().then(data => {
            setRes(data);
        })       
    }, [])

    const handleClick = el => {
        resRef.current.style.maxHeight = '5000px';
    
        el.currentTarget.style.display = 'none';
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
                                    <img src={`https://тгмт.рф/img/${data.img}`}
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

export default Resources;
