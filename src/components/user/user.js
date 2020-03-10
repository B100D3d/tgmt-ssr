import React, { useState } from 'react';

import './user.sass';
import UserHeader from './user-header/user-header';
import UserMenu from './user-menu/user-menu';
import UserMain from './user-main/user-main';

import { UserMenuOpenContext } from '../../context';


const User = () => {

    const [isOpen, setOpen] = useState(true)

    return (
        <>
            <UserMenuOpenContext.Provider value={ [isOpen, setOpen] }>
                <UserHeader />
                <div className="flex-container open">
                    <UserMenu />
                    <UserMain />
                </div>
            </UserMenuOpenContext.Provider>
            
        </>
    )
}

export default User;