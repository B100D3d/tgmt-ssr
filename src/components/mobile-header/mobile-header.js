import React from "react"
import BurgerMenu from "components/burger-menu/burger-menu"

import logo from "static/logo.webp"
import "./mobile-header.sass"

const MobileHeader = () => {
    return (
        <>
            <header className="mobile-header">
                <BurgerMenu />
                <div className="header-top">
                    <img src={logo} alt="logo" />
                    <h2>ТУАПСИНСКИЙ ГИДРОМЕТЕОРОЛОГИЧЕСКИЙ ТЕХНИКУМ</h2>
                </div>
            </header>
        </>
    )
}

export default MobileHeader
