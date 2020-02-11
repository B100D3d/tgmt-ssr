import React, {useEffect, useState} from 'react';
import axios from 'axios';

import './resources.sass';
import OpenButton from '../open-button/open-button';


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

const handleClick = el => {
    document.querySelector('.resources')
        .style.maxHeight = '5000px';

    el.currentTarget.style.display = 'none';
}

const Resources = () => {

    const [res, setRes] = useState([])
    useEffect(() => {
        getResources().then(data => {
            setRes(data);
        })       
    }, [])

    return (
        <>
            <div className="resources">
                <h1>Полезные ресурсы</h1>
                <ul>
                    {res.map((data, key) => {
                        return (
                            <li key={key}>
                                <a href={data.url} target="_blank" 
                                                rel="noopener noreferrer">
                                    <img src={`https://тгмт.рф/img/${data.img}`}
                                        alt="Полезные ресурсы" />
                                </a>
                                <div className="text-container">
                                    <p>{data.text}</p> 
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <OpenButton onClick={handleClick} />
        </>
    )
}

export default Resources;
