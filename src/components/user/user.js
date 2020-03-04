import React from 'react';

import './user.sass';
import UserHeader from './user-header/user-header';
import UserMenu from './user-menu/user-menu';
import UserMain from './user-main/user-main';



const User = () => {
    return (
        <>
            <UserHeader />
            <div className="flex-container open">
                <UserMenu />
                <UserMain />
            </div>
        </>
    )
}

export default User;