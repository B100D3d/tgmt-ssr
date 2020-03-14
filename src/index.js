import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import axios from 'axios';

import './index.sass';

import MainPage from './pages/MainPage.js';
import Page404 from './pages/Page404';
import AuthPage from './pages/AuthPage';

import { WeekContext } from './context';


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
                <Router>
                    <Switch>
                        <Route exact path='/' component={ MainPage } />
                        <Route path='/user' component={ AuthPage } />
                        <Route path='/documents' component={Test} />
                        <Route component={ Page404 } status={ 404 } />
                    </Switch>
                </Router>
            </WeekContext.Provider>    
        </>
    )
}
        
const Test = () => (
    <>
        <div>Lorem</div>
    </>
)


ReactDOM.render(<App />, document.getElementById('root'));