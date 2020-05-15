import React, {useContext, useEffect, useState} from "react"

import "./mailing.sass"
import MyDropdown from "../../../dropdown/dropdown"
import {UserContext} from "../../../../context";

const TYPE_OPTIONS = [
    { key: "all", value: "all", text: "Все" },
    { key: "group", value: "group", text: "Группы" },
    { key: "students", value: "students", text: "Студенты" },
    { key: "teachers", value: "teachers", text: "Училки" }
]


const Mailing = () => {
    const { user } = useContext(UserContext)
    const [type, setType] = useState()
    const [entities, setEntities] = useState([])

    useEffect(() => {
        console.log(type, entities.length || type === "all")
        setVisibility(type && type !== "all", ".recipients")
        setVisibility(entities.length || type === "all", ".textarea")
        type === "group"
            ? setEntities(user.groups.map((g) => ({ key: g.id, value: g.id, text: g.name })))
            : setEntities([])
    }, [type])


    const handleType = (_, data) => setType(data.value)

    return (
        <div className="mailing-container">
            <h1>Рассылка</h1>
            <div className="mailing">
                <div className="type">
                    <h3>Выберите тип получателя</h3>
                    <MyDropdown options={ TYPE_OPTIONS } placeholder="Выберите тип" onChange={ handleType } />
                </div>
                <div className="recipients">
                    <h3>Выберите получателей</h3>
                    <MyDropdown options={ entities } placeholder="Выберите получателей"
                                multiple search />
                </div>
                <div className="textarea">
                    <h3>Введите текст ёпта</h3>
                    <textarea cols="" rows="10" placeholder="Введите текст рассылки" />
                </div>
                <button className="send-btn">Отправитб</button>
            </div>
        </div>
    )
}

export default Mailing

const setVisibility = (isVisible, selector) => {
    console.log(document.querySelector(selector))
    isVisible
        ? document.querySelector(selector).classList.add("visible")
        : document.querySelector(selector).classList.remove("visible")
}