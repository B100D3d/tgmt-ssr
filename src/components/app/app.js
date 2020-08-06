import React, { useEffect, useState } from "react"
import { Route, Switch } from "react-router-dom"
import Fingerprint from "fingerprintjs2"
import UAParser from "ua-parser-js"
import loadable from "@loadable/component"
import { FingerprintContext, InitialDataContext, WeekContext } from "context"
import { getWeek } from "services"

const MainPage = loadable(() =>
    import(/* webpackChunkName: "MainPage" */ "pages/MainPage")
)
const Page404 = loadable(() =>
    import(/* webpackChunkName: "Page404" */ "pages/Page404")
)
const AuthPage = loadable(() =>
    import(/* webpackChunkName: "AuthPage" */ "pages/AuthPage")
)

const getFingerPrint = async () => {
    const components = await Fingerprint.getPromise({
        preprocessor: (key, value) => {
            if (key === "userAgent") {
                const parser = new UAParser(value)
                return `${parser.getOS().name} ${parser.getBrowser().name}`
            }
            return value
        },
    })
    const values = components.map((c) => c.value)
    return Fingerprint.x64hash128(values.join(""), 31)
}

const App = (props) => {
    const data = props.data || {}

    const [week, setWeek] = useState(data.week)
    const [fingerprint, setFingerprint] = useState()

    useEffect(() => {
        if (!week) {
            getWeek().then(setWeek)
        }
    }, [])

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
        <FingerprintContext.Provider value={fingerprint}>
            <InitialDataContext.Provider value={data}>
                <WeekContext.Provider value={week || {}}>
                    <Switch>
                        <Route exact path="/" component={MainPage} />
                        <Route path="/user" component={AuthPage} />
                        <Route
                            render={({ staticContext }) => {
                                if (staticContext)
                                    staticContext.statusCode = 404
                                return <Page404 />
                            }}
                        />
                    </Switch>
                </WeekContext.Provider>
            </InitialDataContext.Provider>
        </FingerprintContext.Provider>
    )
}

export default App
