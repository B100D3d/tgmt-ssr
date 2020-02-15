import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import './index.sass';

import MainPage from './pages/MainPage.js';

import { WeekContext } from './context';
import useAuth from './hooks/useAuth.hook';



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
            setEven(`${week.even} неделя`);
        })
    },[])

    return (
        <>
            <WeekContext.Provider value={{date, weekNumber, even}}>
                <Router>
                    <Route exact path='/' component={MainPage} />
                    <Route path='/user' component={useAuth} />
                    <Route path='/documents' component={Test} />
                </Router>
            </WeekContext.Provider>    
        </>
    )
}
        
const Test = () => (
    <>
        
    </>
)


ReactDOM.render(<App />, document.getElementById('root'));