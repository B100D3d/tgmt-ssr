import React, { useState } from "react"
import OpenButton from "components/open-button/open-button"

import "./about.sass"
import tgmt from "static/tgmt.webp"

import text from "./text.js"

const About = () => {
    const [opened, setOpened] = useState(false)

    return (
        <>
            <div className={`about ${opened ? "opened" : ""}`}>
                <h2>О техникуме</h2>
                <p>
                    <img src={tgmt} alt="tgmt" />
                </p>
                {text.map((item, i) => (
                    <p key={i}>
                        {i === 0 ? (
                            <>
                                <span>{item[0]}</span>
                                {item.slice(1, item.length)}
                            </>
                        ) : (
                            item
                        )}
                    </p>
                ))}
            </div>
            <OpenButton onClick={() => setOpened(!opened)} />
        </>
    )
}

export default About
