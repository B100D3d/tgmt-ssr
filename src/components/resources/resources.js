import React, { useEffect, useState, useContext } from "react"
import { getResources } from "services"
import OpenButton from "components/open-button/open-button"

import { InitialDataContext } from "context"

import "./resources.sass"

const Resources = () => {
    const data = useContext(InitialDataContext)

    const [opened, setOpened] = useState(false)
    const [res, setRes] = useState(data.resources || [])

    useEffect(() => {
        if (!data.resources) {
            getResources().then((data) => setRes(data))
        }
    }, [])

    return (
        <>
            <div className={`resources ${opened ? "opened" : ""}`}>
                <h1>Полезные ресурсы</h1>
                <ul>
                    {res.map((data, key) => {
                        return (
                            <li key={key}>
                                <a
                                    href={data.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={`https://тгмт.рф/img/${data.img}`}
                                        alt="Полезные ресурсы"
                                    />
                                </a>
                                <div className="text-container">
                                    <p>{data.text}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <OpenButton onClick={() => setOpened(!opened)} />
        </>
    )
}

export default Resources
