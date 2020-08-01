import { logout as logoutApi } from "services"
import { useHistory } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "context"

const useLogout = () => {

    const history = useHistory()
    const { setUser, setError } = useContext(UserContext)

    return () =>
        logoutApi()
            .then(() => {
                setUser(null)
                setError(true)
                history.push("/user")
            })
            .catch(console.log)
}

export default useLogout