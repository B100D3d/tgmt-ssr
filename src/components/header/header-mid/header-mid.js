import React from "react"
import { Link } from "react-router-dom"

import logo from "static/logo.webp"
import "./header-mid.sass"

const HeaderMid = () => {
    return (
        <div className="header-mid">
            <div className="container">
                <Link to="/">
                    <img src={logo} alt="logo" className="logo" />
                </Link>
                <p>
                    ГОСУДАРСТВЕННОЕ БЮДЖЕТНОЕ ПРОФЕССИОНАЛЬНОЕ ОБРАЗОВАТЕЛЬНОЕ
                    УЧРЕЖДЕНИЕ
                    <br />
                    КРАСНОДАРСКОГО КРАЯ "ТУАПСИНСКИЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ
                    ТЕХНИКУМ"
                </p>
            </div>
        </div>
    )
}

export default HeaderMid
