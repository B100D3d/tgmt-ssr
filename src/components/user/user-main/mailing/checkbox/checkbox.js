import React from "react"

import "./checkbox.sass"
import check from "static/correct.svg"


const Checkbox = ({ onClick }) => {
    return (
        <div className="checkbox">
            <span>Все</span>
            <input type="checkbox" id="check" onClick={ onClick } />
            <div className="checked">
                <img src={ check } alt="check" />
            </div>
        </div>
    )
}

export default Checkbox