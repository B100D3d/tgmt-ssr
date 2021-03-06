import {
    ExpressParams,
    Student,
    StudentChangedData,
    StudentCreatingData,
    StudentID,
    StudentRegData,
    StudentsGetData,
    UserModel
} from "../types"
import mongoose from "mongoose"
import userModel from "./MongoModels/userModel"
import {generateLogin, generatePassword, generateStudentID, sortByName} from "./Utils"
import groupModel from "./MongoModels/groupModel"
import studentModel from "./MongoModels/studentModel"
import {sendEmailChangedEmail, sendUserCreatingEmail} from "./Email"
import {getWeekNumber} from "./Date"
import recordsModel from "./MongoModels/recordsModel"
import { formatSchedule } from "./Schedule"
import { startSession } from "./mongodb"


export const getStudents = async (
    { studentID, studentsID, groupsID }: StudentsGetData,
    { res }: ExpressParams
): Promise<Array<Student>> => {

    const student = studentID
        ? await studentModel.findOne({ id: studentID }).exec()
        : null
    const studentsNames = studentsID
        ? (await studentModel.find({ id: { $in: studentsID } }).exec()).map(s => s.name)
        : groupsID
        ? (await groupModel
                .find({ id: { $in: groupsID } })
                .populate("students")
                .exec())
                .reduce((names, group) => {
                    names = [ ...names, ...group.students.map(s => s.name) ]
                    return names
                }, Array<string>())
        : null

    const studentsDB = student
                        ? [await userModel
                            .findOne({ role: "Student", name: student.name })
                            .populate({ path: "student", populate: { path: "group" }})
                            .exec()]
                        : studentsNames
                        ? await userModel
                            .find({ role: "Student", name: { $in: studentsNames } })
                            .populate({ path: "student", populate: { path: "group" }})
                            .exec()
                        : await userModel
                            .find({ role: "Student" })
                            .populate({ path: "student", populate: { path: "group" }})
                            .exec()

    if (!studentsDB) {
        console.log("Students not found")
        res.status(404)
        return
    }

    const students = studentsDB
        .sort(sortByName)
        .map(
        ({ name, email, student: { id, group: { year, id: groupId, name: groupName }}}: UserModel) => 
        ({ name, email, id, group: { year, id: groupId, name: groupName }})
    )

    return students
}

export const changeStudent = async (
    args: StudentChangedData,
    { req, res }: ExpressParams
): Promise<Student> => {

    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }
    try {
        
        const { studentID: id, data: { name, email, groupID } } = args

        if(!name || !groupID) return

        const student = await studentModel.findOne({ id }).exec()
        const user = await userModel.findOne({ student: student._id }).exec()
        const group = await groupModel.findOne({ id: groupID }).exec()
        const oldGroup = await groupModel.findById(student.group).exec()

        if (!(student && user && group)) {
            res.status(404)
            return
        }

        const newId = generateStudentID(name, group.id)
        const studentData = { id: newId, name, group: group._id }

        const userData = { name, email }

        if(email) {
            sendEmailChangedEmail(name, user.role, email)
        }

        await studentModel.findByIdAndUpdate(student._id, studentData, opts).exec()
        await userModel.findByIdAndUpdate(user._id, userData, opts).exec()

        oldGroup.students.pull(student._id)
        group.students.push(student._id)
        await oldGroup.save(opts)
        await group.save(opts)

        await session.commitTransaction()
        session.endSession()

        return { 
            id: student.id,
            name,
            email,
            group: {
                id: group.id,
                name: group.name,
                year: group.year
            }
        }
    } catch(err) {
        console.log(err)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}


export const createStudent = async (
    args: StudentCreatingData,
    { req, res }: ExpressParams
): Promise<StudentRegData | null> => {
    await studentModel.createCollection()
    await userModel.createCollection()

    const { name, email, group } = args
    const password = generatePassword()
    const login = generateLogin(name)
    const id = generateStudentID(name, group)
    const role = "Student"
    
    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }
    try {


        const groupDB = await groupModel.findOne({ id: group }).exec()

        if (!groupDB) {
            console.log("Group not found")
            res.status(404)
            return
        }

        const student = new studentModel({
            id,
            name,
            group: groupDB._id
        })

        const user = new userModel({
            name,
            login,
            email,
            role,
            student: student._id
        })

        groupDB.students.addToSet(student._id)

        await user.setPassword(password)

        await student.save(opts)
        await groupDB.save(opts)
        await user.save(opts)
        await session.commitTransaction()
        session.endSession()
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

export const deleteStudent = async (
    { studentID }: StudentID,
    { req, res }: ExpressParams
): Promise<Boolean> => {

    const student = await studentModel.findOne({ id: studentID }).exec()

    if(!student) {
        console.log("Student not found")
        res.status(404)
        return
    }

    const user = await userModel.findOne({ student: student._id }).exec()
    const group = await groupModel.findById(student.group).exec()

    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }

    try {
        await recordsModel.deleteMany({ student: student._id }, opts).exec()
        group.students.pull(student._id)

        await group.save(opts)
        await studentModel.deleteOne({ _id: student._id }, opts).exec()
        await userModel.deleteOne({ _id: user._id }, opts).exec()

        await session.commitTransaction()



    } catch(e) {
        console.log("Student not deleted", e)
        await session.abortTransaction()

        res.status(500)
        return
    }

    session.endSession()
    return true

}

export const getStudentData = async (
    user: UserModel
): Promise<Student> => {
    const { login, name, role, email } = user

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

    const schedule = formatSchedule(
        studentDB.student.group.schedule,
        { subgroup: 1, even: !(getWeekNumber() % 2) }
    )

    const group = {
        id: studentDB.student.group.id,
        name: studentDB.student.group.name,
        year: studentDB.student.group.year
    }

    return {
        login,
        name,
        email,
        role,
        group,
        schedule
    }
}