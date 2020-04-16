import { 
    Student, 
    UserModel, 
    StudentCreatingData,
    ExpressParams,
    StudentRegData,
    ScheduleModel,
    StudentChangedData,
    GroupModel
} from "../types"
import mongoose from "mongoose"
import userModel from "./MongoModels/userModel"
import { generatePassword, generateLogin, generateStudentID, removeNullAndUndefinedProps } from "./Utils"
import groupModel from "./MongoModels/groupModel"
import studentModel from "./MongoModels/studentModel"
import { sendUserCreatingEmail, sendEmailChangedEmail } from "./Email"
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

export const changeStudent = async (args: StudentChangedData, { res }: ExpressParams): Promise<Student> => {

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
        
        const { studentID: id, data: { name, email, groupID } } = args

        const student = await studentModel.findOne({ id }).exec()
        const user = await userModel.findOne({ student: student._id }).exec()
        const group = await groupModel.findOne({ id: groupID }).exec()
        
        const studentData: Record<string, any> = removeNullAndUndefinedProps({ name })
        if(name || group) {
            const oldGroup = await groupModel.findById(student.group).exec()
            if(group) {
                oldGroup.students.pull(student._id)
                group.students.push(student._id)
                studentData.group = group._id
                await oldGroup.save(opts)
                await group.save(opts)
            }
            const newId = generateStudentID(name ?? student.name, group?.id ?? oldGroup.id )
            studentData.id = newId
        }

        await studentModel.findByIdAndUpdate(student._id, studentData, opts)

        const userData: Record<string, string> = removeNullAndUndefinedProps({ name })
        if(email) {
            userData.email = email
            sendEmailChangedEmail(user.name, user.role, email)
        }
        await userModel.updateOne({ student: student._id }, userData, opts).exec()
        await session.commitTransaction()

        const groupData = group 
            ? {
                id: group.id,
                name: group.name,
                year: group.year
            }
            : undefined

        return { 
            id: studentData.id ?? id,
            name,
            email,
            group: groupData
        }
    } catch(err) {
        console.log(err)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}


export const createStudent = async (args: StudentCreatingData, { res }: ExpressParams): Promise<StudentRegData | null> => {
    await studentModel.createCollection()
    await userModel.createCollection()

    const { name, email, groupName } = args
    const password = generatePassword()
    const login = generateLogin(name)
    const id = generateStudentID(name, groupName)
    const role = "Student"
    
    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
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

        await student.save(opts)
        await group.save(opts)
        await user.save(opts)
        await session.commitTransaction()

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
        await session.abortTransaction()
        session.endSession()
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
    .filter(({ subgroup, even }: ScheduleModel) => (subgroup === 1 && even === !(getWeekNum() % 2)))
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