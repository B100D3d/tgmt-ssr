import React from "react"
import Helmet from "react-helmet"

import useAuth from "/hooks/useAuth.hook"

const AuthPage = () => (    
    <>
        <Helmet>
            <meta name="description" content="Личный кабинет Туапсинского Гидрометеорологического Техникума" />
            <meta name="keywords" content="ТГМТ, тгмт, туапсинский гидрометеорологический техникум, личный кабинет тгмт" />
            <title>Личный кабинет | ТГМТ</title>
        </Helmet>
        { useAuth() }    
    </>
)

export default AuthPage