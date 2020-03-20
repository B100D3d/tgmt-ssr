import { 
    Teacher, 
    UserModel, 
    SubjectModel,
    GroupModel,
    UserCreatingData,
    ExpressParams,
    UserRegData
} from "../types"
import userModel from "./MongoModels/userModel"
import groupModel from "./MongoModels/groupModel"
import { generatePassword, generateLogin, generateTeacherID } from "./Utils"
import teacherModel from "./MongoModels/teacherModel"
import { sendUserCreatingEmail } from "./Email"





export const getTeachers = async (): Promise<Array<Teacher>> => {

    const teachersDB = await userModel
                        .find({role: "Teacher"})
                        .populate("teacher")
                        .exec()

    const teachers = teachersDB.map(
        ({ name, email, teacher: { id }}: UserModel) => 
        ({ name, email, id })
    )

    return teachers
}

export const getTeacherData = async (user: UserModel): Promise<Teacher> => {
    const { name, role, email } = user

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
        name,
        email,
        role,
        groups,
        subjects: teacherSubjects
    }

    return teacher
}

export const createTeacher = async (args: UserCreatingData, { res }: ExpressParams): Promise<UserRegData | null> => {
    
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

    try {
        await teacher.save()
        await user.save()

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
        res.status(500)
        return
    }
}