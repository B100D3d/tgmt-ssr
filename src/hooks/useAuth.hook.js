import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import loadable from '@loadable/component';

import { UserContext, FingerprintContext } from '../context/index';

import Loading from '/components/loading/loading'

const Auth = loadable(() => import('/components/auth/auth'), { 
    fallback: 
    <div style={ styles }>
        <Loading width={ 700 } height={ 700 } loading={ true } />
    </div> 
})
const User = loadable(() => import('/components/user/user'), { 
    fallback: 
    <div style={ styles }>
        <Loading width={ 700 } height={ 700 } loading={ true } />
    </div> 
 }) 


const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh'
}

const auth = async (fingerprint) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3002"
    const query = await axios.post(`${url}/api/auth`, {
        query: `{
            auth {
                ...on Admin {
                    name
                    role
                    email
                    groups {
                        id
                        name
                        year
                    }
                }
                ...on Teacher {
                    name
                    role
                    email
                    groups {
                        id
                        name
                        year
                        subjects {
                            id
                        }
                    }
                    subjects {
                        id
                        name
                    }
                }
                ...on Student {
                    name
                    role
                    email
                    group {
                        id
                        name
                        year
                    }
                    schedule {
                        subject {
                            id
                            name
                            teacher
                        }
                        weekday
                        classNumber
                    }
                }
            }
        }`,
        fingerprint
    }, { withCredentials: true });
    return query.data.data.auth;
}

const useAuth = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [user, setUser] = useState()
    const fingerprint = useContext(FingerprintContext)

    useEffect(() => {
        fingerprint && auth(fingerprint)
            .then(userData => {
                setUser(userData)
                setLoading(false)
            })
            .catch(error => {
                setError(true)
                setLoading(false)
            })
    }, [fingerprint])

    if (loading) {
        return (
            <div style={ styles }>
                <Loading width={ 700 } height={ 700 } loading={ loading } />
            </div>
        )
    }
    if (error) {
        return (
            <>
                <UserContext.Provider value={{ setUser, setError }}>
                    <Auth />
                </UserContext.Provider>
            </>
        )
    }
    if (user) {
        return (
            <>
                <UserContext.Provider value={{ user, setUser, setError }}>
                    <User />
                </UserContext.Provider>
            </>
        )
    }


}

export default useAuth;