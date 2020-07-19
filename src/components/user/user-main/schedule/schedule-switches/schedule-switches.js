import React, { useContext, useEffect, useMemo, useState } from "react"
import Switch from "../switch/switch"
import { WeekContext } from "context"

import "./schedule-switches.sass"

const ScheduleSwitches = ({ onChange, firstExecution, isAdmin }) => {
    const { even } = useContext(WeekContext)
    const DEFAULT_SWITCHES_STATE = useMemo(() => ({ even, subgroup: 1 }), [even])
    const [switchesState, setSwitches] = useState({})

    const handleWeek = even => setSwitches(prevState => ({
        ...DEFAULT_SWITCHES_STATE,
        ...prevState,
        even
    }))

    const handleSubgroup = subgroup => setSwitches(prevState => ({
        ...DEFAULT_SWITCHES_STATE,
        ...prevState,
        subgroup
    }))

    useEffect(() => {
        firstExecution && onChange(DEFAULT_SWITCHES_STATE)
    }, [])

    useEffect(() => {
        const hasState = Object.keys(switchesState).length
        hasState && onChange(switchesState)
    }, [switchesState])


    return (
        <div className="switch-container">
            <Switch names={["Чет", "Неч", "Все"]} title="Неделя" isAdmin={ isAdmin }
                    values={[true, false, null]} onChange={ handleWeek }
                    initValue={ even } />
            <Switch names={["1", "2", "Все"]}
                    title="Подгруппа"
                    values={[1, 2, null]} isAdmin={ isAdmin } onChange={ handleSubgroup }
                    initValue={ 1 } />
        </div>
    )
}

export default ScheduleSwitches