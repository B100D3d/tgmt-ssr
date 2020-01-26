import React, {useContext} from 'react';
import { Link } from 'react-router-dom';

import './header-menu.sass';
import {WeekContext} from '../../../context';


const HeaderMenu = () => {

    const {date, weekNumber, even} = useContext(WeekContext)

    return (
        <div className="header-menu">
            <div className="container">
                <p className="week">
                    {date}
                    <br />
                    {weekNumber} {even} 
                </p>
                <ul className="menu">
                    <li>
                        Техникум
                        <ul className="sub-menu">
                            <li>О техникуме</li>
                            <li><Link to='/documents'>Документы</Link></li>
                            <li>Образование</li>
                            <li>Руководство</li>
                            <li>Стипендии и иные виды материальной поддержки</li>
                        </ul>
                    </li>

                    <li>
                        Абитуриентам
                        <ul className="sub-menu">
                            <li>Прием 2020</li>
                            <li>Порядок зачисления</li>
                            <li>Списки поступающих, рекомендованных к зачислению</li>
                            <li>ЕГЭ</li>
                            <li>Положение ГБПОУ КК ТГМТ</li>
                        </ul>
                    </li>

                    <li>
                        Студентам
                        <ul className="sub-menu">
                            <li>Прием 2020</li>
                            <li>Порядок зачисления</li>
                            <li>Списки поступающих, рекомендованных к зачислению</li>
                            <li>ЕГЭ</li>
                            <li>Положение ГБПОУ КК ТГМТ</li>
                        </ul>
                    </li>

                    <li>
                        Учебный процесс
                        <ul className="sub-menu right">
                            <li>Прием 2020</li>
                            <li>Порядок зачисления</li>
                            <li>Списки поступающих, рекомендованных к зачислению</li>
                            <li>ЕГЭ</li>
                            <li>Положение ГБПОУ КК ТГМТ</li>
                        </ul>
                    </li>

                    <li>
                        Родителям
                        <ul className="sub-menu right">
                            <li>Прием 2020</li>
                            <li>Порядок зачисления</li>
                            <li>Списки поступающих, рекомендованных к зачислению</li>
                            <li>ЕГЭ</li>
                            <li>Положение ГБПОУ КК ТГМТ</li>
                        </ul>
                    </li>

                </ul>
            </div>
        </div>
    );
};

export default HeaderMenu;