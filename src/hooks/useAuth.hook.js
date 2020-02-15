import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Loading from '../components/loading/loading';
import AuthPage from '../pages/AuthPage';

const styles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: '100vh'
}

const auth = async () => {
    const query = await axios.post('https://тгмт.рф/api/auth', {
        query: `{
            auth {
                name
                role
                email
            }
        }`
    });
    return query.data.data.auth;
}

const useAuth = () => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [user, setUser] = useState()

    useEffect(() => {
        auth()
            .then(auth => {
                setUser(auth)
                setLoading(false)
            })
            .catch(error => {
                if (error.response.status === 401) {
                    setError(true)
                    setLoading(false)
                }
            })
    }, [])

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
                <AuthPage setUser={setUser} setError={setError} />
            </>
        )
    }
    if (user) {
        return (
            <>
                <h1>{user.name}</h1>
                <h1>{user.role}</h1>
                <h1>{user.email}</h1>
            </>
        )
    }


}

export default useAuth;