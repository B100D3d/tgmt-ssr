import React from "react"

import "./open-button.sass"
import open from "static/open.svg"

const OpenButton = ({ onClick }) => {
    return (
        <div className="open-container">
            <button className="open" onClick={onClick}>
                <img src={open} alt="open" />
            </button>
        </div>
    )
}

export default OpenButton
