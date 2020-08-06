import React, { useState } from "react"
import { UserMenuOpenContext } from "context"

import UserHeader from "components/user/user-header/user-header"
import UserMenu from "components/user/user-menu/user-menu"
import UserMain from "components/user/user-main/user-main"

import "./user.sass"

const User = () => {
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <UserMenuOpenContext.Provider value={[isOpen, setOpen]}>
                <UserHeader />
                <div className={`flex-container ${isOpen ? "open" : ""}`}>
                    <UserMenu />
                    <UserMain />
                </div>
            </UserMenuOpenContext.Provider>
        </>
    )
}

export default User
