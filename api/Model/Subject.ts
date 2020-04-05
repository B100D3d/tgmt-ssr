import { 
    Subject, 
    SubjectModel, 
    SubjectData,
    ExpressParams,
    CreatedSubject
} from "../types"
import mongoose from "mongoose"
import subjectModel from "./MongoModels/subjectModel"
import { generateSubjectID } from "./Utils"
import teacherModel from "./MongoModels/teacherModel"



export const getSubjects = async (): Promise<Array<Subject>> => {

    const subjectsDB = await subjectModel.find().populate("teacher").exec()

    const subjects = subjectsDB.map(
        ({ id, name, teacher: { name: teacher }}: SubjectModel) =>
        ({ id, name, teacher })
    )

    return subjects
}

export const createSubject = async (args: SubjectData, { res }: ExpressParams): Promise<CreatedSubject> => {

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

export const deleteSubject = async (args: SubjectData, { res }: ExpressParams): Promise<boolean> => {
    const { name, teacher: teacherName } = args 

    const teacher = await teacherModel.findOne({ name: teacherName }).exec()

    const subject = await subjectModel.findOne({ name, teacher: teacher._id }).exec()

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