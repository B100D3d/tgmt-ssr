import userModel from "./MongoModels/userModel"
import {
    UserModel,
    Admin,
    ChangingPassword,
    Student,
    Teacher,
    ExpressParams,
    UserInfo,
    Login,
    Email,
    LoginInfo, User
} from "../types"
import mongoose from "mongoose"
import { sendLoginEmail, sendPassChangedEmail, sendEmailChangedEmail, sendLoginChangedEmail } from "./Email"
import { getAdminData } from "./Admin"
import { getStudentData } from "./Student"
import { getTeacherData } from "./Teacher"

const DEFAULT_OPTIONS = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }

const getUserData = (user: UserModel, ex: ExpressParams): Promise<Admin | Teacher | Student> => {
    const USER_DATA_FUNC: {[key: string]: Function} = {
        "Admin": getAdminData,
        "Student": getStudentData,
        "Teacher": getTeacherData
    }

    return USER_DATA_FUNC[user.role](user, ex)
}


export const auth = async (_: any, { req, res }: ExpressParams): Promise<Admin | Teacher | Student> => {

    try {
        const user = req.user

        const options = +process.env.PROD ? { ...DEFAULT_OPTIONS, secure: true } : DEFAULT_OPTIONS
        const token = user.generateJWT()
        res.cookie("token", token, options)

        return getUserData(user, { req, res });

    } catch (err) {
        console.log(err)
        res.status(500)
        return
    }
}

export const login = async ({ login, password }: LoginInfo, { req, res }: ExpressParams): Promise<Admin | Teacher | Student> => {

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
        const fingerprint = req.body.fingerprint
        const user = await userModel.findOne({ login }).exec()

        if (!user) {
            res.status(403)
            return
        }

        const isPasswordValid = await user.isPasswordValid(password)

        if (!isPasswordValid) {
            res.status(403)
            return
        }

        const isFingerprintValid = user.isFingerprintValid(fingerprint)

        if (!isFingerprintValid) {
            user.fingerprints.push(fingerprint)
            if(user.fingerprints.length === 4) {
                user.fingerprints.shift()
            }

            await user.save(opts)
            await session.commitTransaction()

            user.email && sendLoginEmail(user.name, user.email, user.role, req)

        }
        

        const options = +process.env.PROD ? { ...DEFAULT_OPTIONS, secure: true } : DEFAULT_OPTIONS
        const token = user.generateJWT()
        res.cookie("token", token, options)

        return getUserData(user, { req, res })

    } catch (err) {
        console.log(err)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}

export const getUsers = async ({ res }: ExpressParams): Promise<Array<User>> => {

    const users = await userModel.find().exec()

    if(!users) {
        console.log("Users not found")
        res.status(404)
        return
    }

    return users
}

const changeEmail = (user: UserModel, { email }: Email): void => {
    user.email = email
}

const changePassword = async (user: UserModel, { newPassword }: ChangingPassword): Promise<void> => {
    await user.setPassword(newPassword)
}

const changeLogin = (user: UserModel, { login }: Login): void => {
    user.login = login
}

export const changeUserInfo = async (args: UserInfo, { req, res }: ExpressParams): Promise<boolean> => {

    const { login, email, password, newPassword } = args

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }

    try {

        const user = req.user

        const isPasswordValid = await user.isPasswordValid(password)

        if (!isPasswordValid) {
            res.status(403)
            return
        }

        login && changeLogin(user, args)
        email && changeEmail(user, args)
        newPassword && await changePassword(user, args)

        await user.save(opts)
        await session.commitTransaction()

        login && user.email && sendLoginChangedEmail(user.name, user.role, user.email, user.login)
        newPassword && user.email && sendPassChangedEmail(user.name, user.role, user.email, newPassword)
        email && user.email && sendEmailChangedEmail(user.name, user.role, user.email)

    } catch (e) {
        console.log(e)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}

export const clearFingerprints = async ({ req, res }: ExpressParams): Promise<boolean> => {
    const user = req.user

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }

    try {
        user.fingerprints = []
        await user.save(opts)
        await session.commitTransaction()

        return true
    } catch (e) {
        console.log(e)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return false
    }

}
