import { 
    UserModel, 
    Admin, 
    AdminCreatingData,
    ExpressParams,
    UserRegData
} from "../types";
import { getGroups } from "./Group";
import { generatePassword, generateLogin } from "./Utils";
import userModel from "./MongoModels/userModel";
import { sendUserCreatingEmail } from "./Email";



export const getAdminData = async (user: UserModel): Promise<Admin> => {
    const { name, role, email } = user

    const groups = await getGroups()

    const admin: Admin = {
        name,
        role,
        email,
        groups
    }

    return admin;
}


export const createAdmin = async (args: AdminCreatingData, { res }: ExpressParams): Promise<UserRegData | null> => {

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

    try {
        await admin.save()
        const userRegData: UserRegData = {...args, role }

        if (email) {
            sendUserCreatingEmail(userRegData)
        }

        return userRegData

    } catch (err) {
        console.log(`Admin didn't saved: \n ${err}`)
        res.status(500)
        return
    }

}