import React from "react"
import Helmet from "react-helmet"
import loadable from "@loadable/component"
import useAuth from "hooks/useAuth"
import { UserContext } from "context"

const Loading = loadable(() =>
    import(/* webpackChunkName: "Loading" */ "components/loading/loading")
)

const styles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
}

const LoadingWrapper = () => (
    <div style={styles}>
        <Loading width={700} height={700} loading={true} />
    </div>
)

const Login = loadable(
    () => import(/* webpackChunkName: "Login" */ "components/login/login"),
    {
        fallback: <LoadingWrapper />,
    }
)
const User = loadable(
    () => import(/* webpackChunkName: "User" */ "components/user/user"),
    {
        fallback: <LoadingWrapper />,
    }
)

const AuthPage = () => {
    const { loading, error, user, setUser, setError } = useAuth()

    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Личный кабинет Туапсинского Гидрометеорологического Техникума"
                />
                <meta
                    name="keywords"
                    content="ТГМТ, тгмт, туапсинский гидрометеорологический техникум, личный кабинет тгмт"
                />
                <title>Личный кабинет | ТГМТ</title>
            </Helmet>
            {loading && <LoadingWrapper />}
            {error && (
                <UserContext.Provider value={{ setUser, setError }}>
                    <Login />
                </UserContext.Provider>
            )}
            {user && (
                <UserContext.Provider value={{ user, setUser, setError }}>
                    <User />
                </UserContext.Provider>
            )}
        </>
    )
}

export default AuthPage
