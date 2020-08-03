import { logout as logoutApi } from "services"
import { useHistory } from "react-router-dom"
import { useContext } from "react"
import {FingerprintContext, UserContext} from "context"

const useLogout = () => {

    const history = useHistory()
    const { setUser, setError } = useContext(UserContext)
    const fingerprint = useContext(FingerprintContext)

    return () =>
        logoutApi(fingerprint)
            .then(() => {
                setUser(null)
                setError(true)
                history.push("/user")
            })
            .catch(console.log)
}

export default useLogout