import { 
    Student, 
    UserModel, 
    StudentCreatingData,
    ExpressParams,
    StudentRegData,
    ScheduleModel
} from "../types"
import userModel from "./MongoModels/userModel"
import { generatePassword, generateLogin, generateStudentID } from "./Utils"
import groupModel from "./MongoModels/groupModel"
import studentModel from "./MongoModels/studentModel"
import { sendUserCreatingEmail } from "./Email"
import { getWeekNum } from "./Date"



export const getStudents = async (): Promise<Array<Student>> => {

    const studentsDB = await userModel
                        .find({ role: "Student" })
                        .populate({ path: "student", populate: { path: "group" }})
                        .exec()

    const students = studentsDB.map(
        ({ name, email, student: { id, group: { year, id: groupId, name: groupName }}}: UserModel) => 
        ({ name, email, id, group: { year, id: groupId, name: groupName }})
    )

    return students
}


export const createStudent = async (args: StudentCreatingData, { res }: ExpressParams): Promise<StudentRegData | null> => {

    const { name, email, groupName } = args
    const password = generatePassword()
    const login = generateLogin(name)
    const id = generateStudentID(name, groupName)
    const role = "Student"

    try {
        const group = await groupModel.findOne({ name: groupName }).exec()

        if (!group) {
            console.log("Group not found")
            res.status(404)
            return
        }

        const student = new studentModel({
            id,
            name,
            group: group._id
        })

        const user = new userModel({
            name,
            login,
            email,
            role,
            student: student._id
        })

        group.students.addToSet(student._id)

        await user.setPassword(password)

        await student.save()
        await group.save()
        await user.save()

        const studentRegData: StudentRegData = {
            ...args,
            login,
            password,
            role
        }

        if (email) {
            sendUserCreatingEmail(studentRegData)
        }

        return studentRegData

    } catch (err) {
        console.log(`Student didn't saved: \n${err}`)
        res.status(500)
        return
    }

}



export const getStudentData = async (user: UserModel): Promise<Student> => {
    const { name, role, email } = user

    const studentDB = await user.populate({
        path: "student",
        populate: {
            path: "group",
            populate: {
                path: "schedule",
                populate: {
                    path: "subject",
                    populate: {
                        path: "teacher"
                    }
                }
            }
        }
    }).execPopulate()

    const schedule = studentDB.student.group.schedule
    .filter(({ subgroup, even }: ScheduleModel) => (subgroup === 1 && even === !!(getWeekNum() % 2)))
    .map(
        ({ subject: { id, name, teacher }, classNumber, weekday }: ScheduleModel) => 
        ({ subject: { id, name, teacher: teacher.name }, classNumber, weekday })
    )

    const group = {
        id: studentDB.student.group.id,
        name: studentDB.student.group.name,
        year: studentDB.student.group.year
    }

    const student: Student = 
    {
        name,
        email,
        role,
        group,
        schedule
    }

    return student
}