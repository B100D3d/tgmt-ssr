import React from "react"

import "./second-menu.sass"

const SecondMenu = () => {
    return (
        <ul className="second-menu">
            <li>
                <a>Противодействие коррупции</a>
                <div className="sub-menu sub-menu-1">

                </div>
            </li>
            <li>
                <a>Информационная безопасность</a>
                <div className="sub-menu sub-menu-2">

                </div>
            </li>
            <li>
                <a>Финансовая грамотность</a>
                <div className="sub-menu-container">
                    <div className="sub-menu sub-menu-3">

                    </div>
                </div>
            </li>
        </ul>
    )
}

export default SecondMenu