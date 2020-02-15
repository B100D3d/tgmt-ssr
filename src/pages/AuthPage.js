import React from 'react'

import Auth from '../components/auth/auth.js';

const AuthPage = ({ setUser, setError }) => {
    return (
        <>
            <Auth setUser={setUser} setError={setError} />
        </>
    )
}

export default AuthPage;