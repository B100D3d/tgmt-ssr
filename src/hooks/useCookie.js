import { useEffect, useReducer, useCallback } from "react"
import { getCookies } from "utils"

const SET_COOKIES = "SET_COOKIES"
const SET_COOKIE = "SET_COOKIE"

const cookiesReducer = (cookies, action) => {
    switch (action.type) {
        case SET_COOKIES:
            return action.cookies
        case SET_COOKIE:
            return { ...cookies, ...action.cookie }
        default:
            return cookies
    }
}

const useCookie = (namesList) => {
    const [cookies, dispatch] = useReducer(cookiesReducer, null, () => null)

    const setCookie = useCallback((key, value) => {
        document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
        dispatch({ type: SET_COOKIE, cookie: { [key]: `${value}` } })
    }, [])

    useEffect(() => {
        dispatch({ type: SET_COOKIES, cookies: getCookies(namesList) })
    }, [namesList])

    return [cookies, setCookie]
}

export default useCookie
