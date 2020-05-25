import { logout as logoutApi } from "api"

const logout = (history, setUser, setError) => {
    logoutApi()
        .then(() => {
            setUser(null)
            setError(true)
            history.push("/user")
        })
}

export default logout