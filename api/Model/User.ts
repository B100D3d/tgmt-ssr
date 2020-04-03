import userModel from "./MongoModels/userModel"
import {
    UserModel,
    Admin,
    LoginInfo,
    Email,
    PasswordsInfo,
    Student,
    Teacher,
    ExpressParams} from "../types"
import { sendLoginEmail, sendPassChangedEmail, sendEmailChangedEmail } from "./Email"
import { getAdminData } from "./Admin"
import { getStudentData } from "./Student"
import { getTeacherData } from "./Teacher"

const DEFAULT_OPTIONS = { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }

const getUserData = (user: UserModel): Promise<Admin | Teacher | Student> => {
    const USER_DATA_FUNC: {[key: string]: Function} = {
        "Admin": getAdminData,
        "Student": getStudentData,
        "Teacher": getTeacherData
    }

    return USER_DATA_FUNC[user.role](user)
}


export const auth = async (_: any, { req, res }: ExpressParams): Promise<Admin | Teacher | Student> => {

    const { uniqueId } = req.user;
    const fingerprint = req.body.fingerprint

    try {
        const user = await userModel.findById(uniqueId).exec()

        if (!user) {
            res.status(401)
            return
        }

        const isFingerprintValid = user.isFingerprintValid(fingerprint)

        if (!isFingerprintValid) {
            res.status(401) /*TODO: change status to 403 and add check for frontend*/ 
            return
        }

        const options = +process.env.PROD ? { ...DEFAULT_OPTIONS, secure: true } : DEFAULT_OPTIONS
        const token = user.generateJWT()
        res.cookie("token", token, options)

        return getUserData(user);

    } catch (err) {
        console.log(err)
        res.status(500)
        return
    }
}

export const login = async ({ login, password }: LoginInfo, { req, res }: ExpressParams): Promise<Admin | Teacher | Student> => {

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

            await user.save()

            if (user.email) {
                sendLoginEmail(user.name, user.email, user.role, req)
            }
        }

        const options = +process.env.PROD ? { ...DEFAULT_OPTIONS, secure: true } : DEFAULT_OPTIONS
        const token = user.generateJWT()
        res.cookie("token", token, options)

        return getUserData(user)

    } catch (err) {
        console.log(err)
        res.status(500)
        return
    }
}

export const setEmail = async ({ email }: Email, { req, res }: ExpressParams): Promise<Email | null> => {

    const { uniqueId } = req.user;

    try {
        const user = await userModel.findByIdAndUpdate(uniqueId, { email }, { new: true }).exec()

        if (!user) {
            res.status(401)
            return
        }

        sendEmailChangedEmail(user.name, user.role, user.email)

        return { email: user.email }

    } catch (err) {
        console.log(err)
        res.status(500)
        return
    }
}

export const changePassword = async ({ oldPassword, newPassword }: PasswordsInfo, { req, res }: ExpressParams): Promise<boolean> => {

    const { uniqueId } = req.user;

    try {
        const user = await userModel.findById(uniqueId).exec()

        if (!user) {
            res.status(401)
            return
        }

        const isPasswordValid = await user.isPasswordValid(oldPassword)

        if (!isPasswordValid) {
            res.status(403)
            return
        }

        await user.setPassword(newPassword)
        await user.save()

        if (user.email) {
            sendPassChangedEmail(user.name, user.role, user.email, newPassword)
        }

        return true

    } catch (err) {
        console.log(err)
        res.status(500)
        return
    }
}
