import React, { useState, useEffect } from "react"
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import MainPage from '../../pages/MainPage.js';
import Page404 from '../../pages/Page404';
import AuthPage from '../../pages/AuthPage';

import { WeekContext } from '../../context';


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

const App = () => {
    const [date, setDate] = useState('');
    const [weekNumber, setWeekNumber] = useState('');
    const [even, setEven] = useState('');

    useEffect(() => {
        getWeek().then(week => {
            setDate(week.date);
            setWeekNumber(week.weekNum);
            setEven(`${ week.even } неделя`);
        })
    },[])

    return (
        <>
            <WeekContext.Provider value={{ date, weekNumber, even }}>
                    <Switch>
                        <Route exact path='/' component={ MainPage } />
                        <Route path='/user' component={ AuthPage } />
                        <Route path='/documents' component={Test} />
                        <Route render={({staticContext}) => {
                            if (staticContext) staticContext.statusCode = 404;
                            return <Page404></Page404>;
                        }} />
                    </Switch>
            </WeekContext.Provider>    
        </>
    )
}
        
const Test = () => (
    <>
        <div>Lorem</div>
    </>
)

export default App;