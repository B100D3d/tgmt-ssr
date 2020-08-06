import React from "react"
import { Link } from "react-router-dom"
import loadable from "@loadable/component"
import Search from "components/search/search"
import "./header-top.sass"
import eye from "static/eye.svg"
import student from "static/student.svg"
const RainbowButton = loadable(() =>
    import(
        /* webpackChunkName: "RainbowButton" */ "components/rainbow-button/rainbow-button"
    )
)

const HeaderTop = () => {
    return (
        <div className="header-top">
            <div className="container">
                <button className="contrast">
                    <img
                        src={eye}
                        alt="eye"
                        className="eye"
                        width="30px"
                        height="30px"
                    />
                    Версия для слабовидящих
                </button>
                <Search />
                <Link to="/user">
                    <RainbowButton className="login" interval={2000}>
                        <img src={student} alt="student" className="student" />
                        Личный кабинет
                    </RainbowButton>
                </Link>
            </div>
        </div>
    )
}

export default HeaderTop
