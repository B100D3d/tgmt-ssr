import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import './header-menu.sass';


const HeaderMenu = () => {

    const [date, setDate] = useState('28 апреля 2007');
    const [weekNumber, setWeekNumber] = useState(16);
    const [even, setEven] = useState('четная');

     useEffect(() => {
         const fetchData = async () => {
            const query = await axios.post('http://localhost:3001/api/mainPage', {
                query: `{
                    week {
                            date
                            weekNum
                            even
                        }
                    }`
            });
            const data = query.data.data.week;
            setDate(data.date);
            setWeekNumber(data.weekNum);
            setEven(data.even); 
         };
        fetchData();
    },[])

    return (
        <div className="header-menu">
            <div className="container">
                <p className="week">
                    {date}
                    <br />
                    {weekNumber} {even} неделя
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