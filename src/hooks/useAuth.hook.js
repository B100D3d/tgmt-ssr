import React, { useEffect, useState, useContext } from "react"

import { FingerprintContext } from "context"

import { auth } from "api"

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

    return {
        user,
        loading,
        error,
        setUser,
        setError
    }
}

export default useAuth