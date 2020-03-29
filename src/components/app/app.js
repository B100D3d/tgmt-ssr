import React, { useState, useEffect } from "react"
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import loadable from '@loadable/component'

const MainPage = loadable(() => import('/pages/MainPage'))
const Page404 = loadable(() => import('/pages/Page404'))
const AuthPage = loadable(() => import('/pages/AuthPage'))

import { WeekContext, InitialDataContext } from '/context';


const getWeek = async () => {
    const query = await axios.post('https://тгмт.рф/api/mainPage', {
            query: `{
                 week {
                        date
                        weekNum
                        even
                    }
                }`
            });
    return query.data.data.week;
}

const App = (props) => {
    const data = props.data

    const { week } = data
    const [date, setDate] = useState(week?.date || '')
    const [weekNumber, setWeekNumber] = useState(week?.weekNum || '')
    const [even, setEven] = useState((week?.even && `${week?.even} неделя`) || '')

    useEffect(() => {
        if(!(date && weekNumber && even)) {
            getWeek().then(week => {
                setDate(week.date)
                setWeekNumber(week.weekNum)
                setEven(`${ week.even } неделя`)
            })
        }
        
    },[])

    return (
        <InitialDataContext.Provider value={ data }>
            <WeekContext.Provider value={{ date, weekNumber, even }}>
                    <Switch>
                        <Route exact path='/' component={ MainPage } />
                        <Route path='/user' component={ AuthPage } />
                        <Route path='/documents' component={ Test } />
                        <Route render={({ staticContext }) => {
                            if (staticContext) staticContext.statusCode = 404;
                            return <Page404></Page404>;
                        }} />
                    </Switch>
            </WeekContext.Provider>   
        </InitialDataContext.Provider> 
    )
}
        
const Test = () => (
    <>
        <div>Lorem</div>
    </>
)

export default App;