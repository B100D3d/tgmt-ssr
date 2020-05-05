import {
    Subject,
    SubjectModel,
    SubjectData,
    ExpressParams,
    CreatedSubject,
    SubjectGettingData, SubjectID, SubjectChangingData
} from "../types"
import mongoose from "mongoose"
import subjectModel from "./MongoModels/subjectModel"
import { generateSubjectID } from "./Utils"
import teacherModel from "./MongoModels/teacherModel"
import groupModel from "./MongoModels/groupModel";



export const getSubjects = async ({ groupID, subjectID }: SubjectGettingData, { res }: ExpressParams): Promise<Array<Subject>> => {

    const subjectsDB = groupID
        ? (await groupModel.findOne({ id: groupID }).populate({
            path: "subjects",
            populate: { path: "teacher" }}).exec()).subjects as SubjectModel[]
        : subjectID
        ? [await subjectModel.findOne({ id: subjectID }).populate("teacher").exec()]
        : await subjectModel.find().populate("teacher").exec()

    if(!subjectsDB) {
        console.log("Subjects not found")
        res.status(404)
        return
    }

    const subjects = subjectsDB.map(
        ({ id, name, teacher: { name: teacher }}: SubjectModel) =>
        ({ id, name, teacher })
    )

    return subjects
}

export const createSubject = async (args: SubjectData, { res }: ExpressParams): Promise<CreatedSubject> => {
    await subjectModel.createCollection()

    const { name, teacher: teacherName } = args
    const id = generateSubjectID(name, teacherName)

    const teacher = await teacherModel.findOne({ name: teacherName }).exec()

    const subject = new subjectModel({
        id,
        name,
        teacher: teacher._id
    })

    teacher.subjects.addToSet(subject._id)

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {

        await subject.save(opts)
        await teacher.save(opts)
        await session.commitTransaction()

        return { ...args, id }

    } catch(err) {
        console.log(`Subject didn't saved: \n${err}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}

export const deleteSubject = async ({ subjectID }: SubjectID, { res }: ExpressParams): Promise<boolean> => {

    const subject = await subjectModel.findOne({ id: subjectID }).exec()
    const teacher = await teacherModel.findById(subject.teacher).exec()

    if(!(subject && teacher)) {
        console.log("Not found subject or teacher")
        res.status(404)
        return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
        teacher.subjects.pull(subject._id)
        await subjectModel.deleteOne({ _id: subject._id }, opts)
        await teacher.save(opts)
        await session.commitTransaction()
        return true
    } catch(err) {
        console.log(`Subject not deleted: ${err}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}


export const changeSubject = async (args: SubjectChangingData, { res }: ExpressParams): Promise<CreatedSubject> => {
    const { subjectID, name, teacher: teacherName } = args

    const id = generateSubjectID(name, teacherName)

    const teacher = await teacherModel.findOne({ name: teacherName }).exec()
    const subject = await subjectModel.findOne({ id: subjectID }).exec()

    if(!(teacher && subject)) {
        console.log("Subject or teacher not found")
        res.status(404)
        return
    }

    const subjectData = { id, name, teacher }

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }

    try {
        if(!subject.teacher.equals(teacher._id)) {
            const oldTeacher = await teacherModel.findById(subject.teacher).exec()
            oldTeacher.subjects.pull(subject._id)
            teacher.subjects.addToSet(subject._id)
            await oldTeacher.save(opts)
            await teacher.save(opts)
        }

        await subject.updateOne(subjectData).exec()
        await session.commitTransaction()

        return { id, name, teacher: teacher.name }


    } catch (e) {
        console.log(`Subject not changed: ${e}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }


}