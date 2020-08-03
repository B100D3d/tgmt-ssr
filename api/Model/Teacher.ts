import {
    Teacher,
    UserModel,
    SubjectModel,
    GroupModel,
    UserCreatingData,
    ExpressParams,
    UserRegData, TeacherID, TeacherChangedData, TeachersGetData
} from "../types"
import userModel from "./MongoModels/userModel"
import groupModel from "./MongoModels/groupModel"
import { generatePassword, generateLogin, generateTeacherID, sortByName } from "./Utils"
import teacherModel from "./MongoModels/teacherModel"
import { sendUserCreatingEmail } from "./Email"
import subjectModel from "./MongoModels/subjectModel"
import {startSession} from "./mongodb";


export const getTeachers = async (
    { teacherID, teachersID }: TeachersGetData,
    { res }: ExpressParams
): Promise<Array<Teacher>> => {

    const teacher = teacherID
        ? await teacherModel.findOne({ id: teacherID }).exec()
        : null
    const teachersNames = teachersID
        ? (await teacherModel.find({ id: { $in: teachersID } }).exec()).map(t => t.name)
        : null

    const teachersDB = teacherID
                        ? [await userModel
                                .findOne({ role: "Teacher", name: teacher.name })
                                .populate("teacher")
                                .exec()]
                        : teachersID
                        ? await userModel
                            .find({ role: "Teacher", name: { $in: teachersNames } })
                        : await userModel
                                .find({ role: "Teacher" })
                                .populate("teacher")
                                .exec()


    if (!teachersDB) {
        console.log("Teachers not found")
        res.status(404)
        return
    }

    const teachers = teachersDB
        .sort(sortByName)
        .map(
        ({ name, email, teacher: { id }}: UserModel) => 
        ({ name, email, id })
    )

    return teachers
}

export const getTeacherData = async (user: UserModel): Promise<Teacher> => {
    const { login, name, role, email } = user

    const userPopulate = await user.populate({
        path: "teacher",
        populate: {
            path: "subjects"
        }
    }).execPopulate()

    const teacherSubjects = userPopulate.teacher.subjects.map(
        ({ id, name }: SubjectModel) =>  ({ id, name })
    )

    const subjectsID = userPopulate.teacher.subjects.map(({ _id }: SubjectModel) => _id)

    const groupsDB = await groupModel
                            .find({ subjects: { "$in": subjectsID }})
                            .populate("subjects")
                            .exec()

    const groups = groupsDB.map(
        ({ id, name, year, subjects: allSubjects }: GroupModel) => {

            const subjects = allSubjects
                                .filter(({ teacher }: SubjectModel) => teacher.equals(userPopulate.teacher._id))
                                .map(({ id }: SubjectModel) => ({ id }))

            return { id, name, year, subjects }
        }
    )

    const teacher: Teacher = {
        login,
        name,
        email,
        role,
        groups,
        subjects: teacherSubjects
    }

    return teacher
}

export const createTeacher = async (
    args: UserCreatingData,
    { req, res }: ExpressParams
): Promise<UserRegData | null> => {
    await userModel.createCollection()
    await teacherModel.createCollection()

    const { name, email } = args
    const password = generatePassword()
    const login = generateLogin(name)
    const id = generateTeacherID(name)
    const role = "Teacher"

    const teacher = new teacherModel({
        id,
        name
    })

    const user = new userModel({
        ...args,
        login,
        role,
        teacher: teacher._id
    })

    await user.setPassword(password)

    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }
    try {
        await teacher.save(opts)
        await user.save(opts)
        await session.commitTransaction()
        session.endSession()

        const teacherRegData: UserRegData = {
            ...args,
            login,
            password,
            role
        }

        if (email) {
            sendUserCreatingEmail(teacherRegData)
        }

        return teacherRegData

    } catch(err) {
        console.log(`Teacher didn't saved: \n${err}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}

export const deleteTeacher = async (
    { teacherID }: TeacherID,
    { req, res }: ExpressParams
): Promise<Boolean> => {

    const teacher = await teacherModel.findOne({ id: teacherID }).exec()
    const user = await userModel.findOne({ teacher: teacher._id }).exec()

    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }

    try {
        await subjectModel.deleteMany({ teacher: teacher._id }, opts).exec()
        await teacherModel.deleteOne({ _id: teacher._id }, opts).exec()
        await userModel.deleteOne({ _id: user._id }, opts).exec()

        await session.commitTransaction()
        session.endSession()

        return true

    }catch (e) {
        console.log("Teacher not deleted", e)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }

}


export const changeTeacher = async (
    args: TeacherChangedData,
    { req, res }: ExpressParams
): Promise<Teacher> => {

    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }
    try {
        const { teacherID: id, data: { name, email } } = args

        const teacher = await teacherModel.findOne({ id }).exec()
        const user = await userModel.findOne({ teacher: teacher._id }).exec()

        const teacherData: Record<string, string> = { name }
        const userData = { ...teacherData, email } as Teacher

        teacherData.id = generateTeacherID(name)

        await teacherModel.findByIdAndUpdate(teacher._id, teacherData, opts)
        await userModel.findByIdAndUpdate(user._id, userData, opts)

        await session.commitTransaction()
        session.endSession()

        return userData

    } catch (e) {
        console.log(e)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }

}