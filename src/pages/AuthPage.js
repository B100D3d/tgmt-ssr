import React from 'react';
import MetaTag from 'react-meta-tags';

import useAuth from '../hooks/useAuth.hook';

const AuthPage = () => (    
    <>
        <MetaTag>
            <meta name="description" content="Личный кабинет Туапсинского Гидрометеорологического Техникума" />
            <meta name="keywords" content="ТГМТ, тгмт, туапсинский гидрометеорологический техникум, личный кабинет тгмт" />
            <title>Личный кабинет</title>
        </MetaTag>
        { useAuth() }    
    </>
)

export default AuthPage;