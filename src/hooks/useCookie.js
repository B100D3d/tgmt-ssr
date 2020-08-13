import { useEffect, useReducer, useCallback } from "react"
import { getCookies } from "utils"

const SET_COOKIE = "SET_COOKIE"

const cookiesReducer = (cookies, action) => {
    switch (action.type) {
        case SET_COOKIE:
            if (Object.keys(action.cookies).length === 1) {
                return Object.values(action.cookies)[0]
            } else {
                return action.cookies
            }
        default:
            return cookies
    }
}

const useCookie = (namesList) => {
    const [cookies, dispatch] = useReducer(cookiesReducer, null, () => null)

    const setCookie = useCallback((key, value) => {
        document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
        dispatch({ type: SET_COOKIE, cookies: getCookies(namesList) })
    }, [])

    useEffect(() => {
        dispatch({ type: SET_COOKIE, cookies: getCookies(namesList) })
    }, [namesList])

    return [cookies, setCookie]
}

export default useCookie
