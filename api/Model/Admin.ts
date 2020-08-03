import { 
    UserModel, 
    Admin, 
    AdminCreatingData,
    ExpressParams,
    UserRegData
} from "../types";
import mongoose from "mongoose"
import { getGroups } from "./Group";
import { generatePassword, generateLogin } from "./Utils";
import userModel from "./MongoModels/userModel";
import { sendUserCreatingEmail } from "./Email";

export const getAdminData = async (user: UserModel): Promise<Admin> => {
    const { login, name, role, email } = user

    const groups = await getGroups()

    const admin: Admin = {
        login,
        name,
        role,
        email,
        groups
    }

    return admin;
}


export const createAdmin = async (args: AdminCreatingData, { res }: ExpressParams): Promise<UserRegData | null> => {
    await userModel.createCollection()

    const { name, email } = args
    let { login, password } = args

    password = password || generatePassword()
    login = login || generateLogin(name)

    const role = "Admin"
    const admin = new userModel({
        name,
        login,
        role,
        email
    })

    await admin.setPassword(password)

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
        await admin.save(opts)
        await session.commitTransaction()

        const userRegData: UserRegData = {...args, role, login, password }

        if (email) {
            sendUserCreatingEmail(userRegData)
        }

        return userRegData

    } catch (err) {
        console.log(`Admin didn't saved: \n ${err}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }

}