import React, { useEffect, useState } from "react"

import "./footer.sass"
import rggmu from "static/rggmu.webp"
import inst from "static/instagram.svg"
import vk from "static/vk.svg"
import google from "static/google.svg"


const Footer = () => {

    const [diff, setDiff] = useState()

    useEffect(() => {
        const currentDate = new Date() //сегодняшняя дата
        const creatingDate = new Date(1952, 6, 16) //дата начала
        setDiff(Math.floor((currentDate - creatingDate) / (1000 * 60 * 60 * 24 * 365)))
    }, [])

    return (
        <div className="footer">
            <div className="title-and-logo">
                <h2>Друзья ТГМТ</h2>
                <div className="friends-container" >
                    <img src={ rggmu } alt="rggmu" className="rggmu" />
                </div>
            </div>
            <div className="info">
                <h2>Контакты</h2>
                <p>Электронная почта ГБПОУ КК ТГМТ tuapse_meteo2003@mail.ru</p>
                <p>Приёмная директора ГБПОУ КК ТГМТ (86167)2-38-14</p>
                <p>Зам. директора по учебной работе (86167)3-38-14</p>
                <p>Зам. директора по воспитательной работе (86167)2-39-51</p>
                <p>Зав. отделением №1 (86167)2-35-56</p>
                <p>Зав. отделением №2 (пос. Новомихайловский) (86167)93-5-57</p>
                <p>Отдел кадров (86167)2-24-71</p>
                <p>Бухгалтерия (86167)2-24-71</p>
                <p>Факс (86167)2-38-14</p>
            </div>
            <div className="social">
                <h2>Присоединяйтесь</h2>
                <a href="#" target="_blank"><img src={ google } alt="google+" className="google" /></a>
                <a href="https://vk.com/tgmt_tuapse" target="_blank"><img src={ vk } alt="vk" className="vk" /></a>
                <a href="https://www.instagram.com/tgmt_tuapse/" target="_blank"><img src={ inst } 
                    alt="instagram" className="inst" /></a>
            </div>
            <span className="subtitle">{ diff } лет успешной деятельности в сфере профессионального образования</span>
            <span className="copyright">Copyright © 2020</span>
        </div >
    )
}

export default Footer