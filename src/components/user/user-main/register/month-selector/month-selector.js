import React, {useEffect, useReducer} from "react"

import "./month-selector.sass"
import {CSSTransition, TransitionGroup} from "react-transition-group";


const MONTHS = {
    0: "Январь",
    1: "Февраль",
    2: "Март",
    3: "Апрель",
    4: "Май",
    5: "Июнь",
    6: "Июль",
    7: "Август",
    8: "Сентябрь",
    9: "Октябрь",
    10: "Ноябрь",
    11: "Декабрь"
}

const monthReducer = (month, action) => {
    switch (action.type) {
        case "INC":
            if (month === 11) return 0
            return month + 1
        case "DEC":
            if (month === 0) return 11
            return month - 1
    }
}

const MonthSelector = ({ onChange }) => {
    const [month, dispatch] = useReducer(monthReducer, new Date().getMonth())

    useEffect(() => {
        onChange(month)
    },[month])

    return (
        <div className="month-selector">
            <button onClick={ () => dispatch({ type: "DEC" }) }>&#8592;</button>
            <TransitionGroup>
                <CSSTransition
                    key={ MONTHS[month] }
                    timeout={ 500 }
                    classNames="fade">
                    <span key={ MONTHS[month] }>{ MONTHS[month] }</span>
                </CSSTransition>
            </TransitionGroup>
            <button onClick={ () => dispatch({ type: "INC" }) }>&#8594;</button>
        </div>
    )
}

export default MonthSelector