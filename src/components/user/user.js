import React, { useState } from "react"
import loadable from "@loadable/component"

const UserHeader = loadable(() => import("./user-header/user-header"))
const UserMenu = loadable(() => import("./user-menu/user-menu"))
const UserMain = loadable(() => import("./user-main/user-main"))

import { UserMenuOpenContext } from "/context"

import "./user.sass"


const User = () => {

    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <UserMenuOpenContext.Provider value={ [isOpen, setOpen] }>
                <UserHeader />
                <div className="flex-container">
                    <UserMenu />
                    <UserMain />
                </div>
            </UserMenuOpenContext.Provider>
            
        </>
    )
}

export default User