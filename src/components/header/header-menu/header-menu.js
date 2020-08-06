import React, { useContext } from "react"
import { Link } from "react-router-dom"
import { WeekContext } from "context"

import "./header-menu.sass"

const HeaderMenu = () => {
    const { date, weekNumber, even } = useContext(WeekContext)

    return (
        <div className="header-menu">
            <div className="container">
                <p className="week">
                    {date || ""}
                    <br />
                    {weekNumber || ""}{" "}
                    {even ? "четная неделя" : "нечетная неделя"}
                </p>
                <ul className="menu">
                    <li>
                        <Link to="/">Техникум</Link>
                        <ul className="sub-menu">
                            <li>
                                <Link to="/">О техникуме</Link>
                            </li>
                            <li>
                                <Link to="/">Документы</Link>
                            </li>
                            <li>
                                <Link to="/">Образование</Link>
                            </li>
                            <li>
                                <Link to="/">Руководство</Link>
                            </li>
                            <li>
                                <Link to="/">
                                    Стипендии и иные виды материальной поддержки
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/">Абитуриентам</Link>
                        <ul className="sub-menu">
                            <li>
                                <Link to="/">Прием 2020</Link>
                            </li>
                            <li>
                                <Link to="/">Порядок зачисления</Link>
                            </li>
                            <li>
                                <Link to="/">
                                    Списки поступающих, рекомендованных к
                                    зачислению
                                </Link>
                            </li>
                            <li>
                                <Link to="/">ЕГЭ</Link>
                            </li>
                            <li>
                                <Link to="/">Положение ГБПОУ КК ТГМТ</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/">Студентам</Link>
                        <ul className="sub-menu">
                            <li>
                                <Link to="/">Прием 2020</Link>
                            </li>
                            <li>
                                <Link to="/">Порядок зачисления</Link>
                            </li>
                            <li>
                                <Link to="/">
                                    Списки поступающих, рекомендованных к
                                    зачислению
                                </Link>
                            </li>
                            <li>
                                <Link to="/">ЕГЭ</Link>
                            </li>
                            <li>
                                <Link to="/">Положение ГБПОУ КК ТГМТ</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/">Учебный процесс</Link>
                        <ul className="sub-menu right">
                            <li>
                                <Link to="/">Прием 2020</Link>
                            </li>
                            <li>
                                <Link to="/">Порядок зачисления</Link>
                            </li>
                            <li>
                                <Link to="/">
                                    Списки поступающих, рекомендованных к
                                    зачислению
                                </Link>
                            </li>
                            <li>
                                <Link to="/">ЕГЭ</Link>
                            </li>
                            <li>
                                <Link to="/">Положение ГБПОУ КК ТГМТ</Link>
                            </li>
                        </ul>
                    </li>

                    <li>
                        <Link to="/">Родителям</Link>
                        <ul className="sub-menu right">
                            <li>
                                <Link to="/">Прием 2020</Link>
                            </li>
                            <li>
                                <Link to="/">Порядок зачисления</Link>
                            </li>
                            <li>
                                <Link to="/">
                                    Списки поступающих, рекомендованных к
                                    зачислению
                                </Link>
                            </li>
                            <li>
                                <Link to="/">ЕГЭ</Link>
                            </li>
                            <li>
                                <Link to="/">Положение ГБПОУ КК ТГМТ</Link>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default HeaderMenu
