import React, { useState, useEffect } from "react"
import { Route, Switch } from 'react-router-dom'
import axios from 'axios'
import loadable from '@loadable/component'
import Fingerprint from 'fingerprintjs2'
import UAParser from 'ua-parser-js'

const MainPage = loadable(() => import('/pages/MainPage'))
const Page404 = loadable(() => import('/pages/Page404'))
const AuthPage = loadable(() => import('/pages/AuthPage'))

import { WeekContext, InitialDataContext, FingerprintContext } from '/context';


const getWeek = async () => {
    const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3002"
    const query = await axios.post(`${url}/api/mainPage`, {
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

const getFingerPrint = async () => {
    const components = await Fingerprint.getPromise({
        preprocessor: (key, value) => {
            if (key === "userAgent") {
                const parser = new UAParser(value)
                const UAMinusVersion = `${ parser.getOS().name } ${ parser.getBrowser().name }`
                return UAMinusVersion
            } 
            return value
        }
    })
    const values = components.map((c) => c.value)
    return Fingerprint.x64hash128(values.join(''), 31)
}


const App = (props) => {
    const data = props.data || {}

    const { week } = data
    const [date, setDate] = useState(week?.date || '')
    const [weekNumber, setWeekNumber] = useState(week?.weekNum || '')
    const [even, setEven] = useState((week?.even && `${week?.even} неделя`) || '')
    const [fingerprint, setFingerprint] = useState()

    useEffect(() => {
        if(!(date && weekNumber && even)) {
            getWeek().then(week => {
                setDate(week.date)
                setWeekNumber(week.weekNum)
                setEven(`${ week.even } неделя`)
            })
        }
        
    },[])

    useEffect(() => {
        if (window.requestIdleCollback) {
            requestIdleCollback(() => {
                getFingerPrint().then(setFingerprint)
            })
        } else {
            setTimeout(() => {
                getFingerPrint().then(setFingerprint)
            }, 500)
        }
    }, [])


    return (
        <FingerprintContext.Provider value={ fingerprint }>
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
        </FingerprintContext.Provider> 
    )
}
        
const Test = () => (
    <>
        <div>Lorem</div>
    </>
)

export default App;