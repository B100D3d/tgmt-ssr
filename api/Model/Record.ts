import {
    ExpressParams,
    Records, RecordsGetData,
    RecordsSetData,
    StudentModel,
    SubjectModel
} from "../types"
import mongoose from "mongoose"
import userModel from "./MongoModels/userModel"
import studentModel from "./MongoModels/studentModel"
import recordModel from "./MongoModels/recordsModel"
import subjectModel from "./MongoModels/subjectModel"
import groupModel from "./MongoModels/groupModel"
import { sortByName } from "./Utils"


export const getStudentRecords = async ({ month }: RecordsGetData, { req }: ExpressParams): Promise<Array<Records>> => {

    const { uniqueId } = req.uniqueId

    const user = await userModel.findById(uniqueId).exec()

    const student = await studentModel
                            .findOne({ name: user.name })
                            .populate({ path: "records group", populate: { path: "subject subjects" }})
                            .exec()

    const subjects = student.group.subjects.map(({ name }: SubjectModel) => name)

    return subjects.map(subject => {
        const recordsByMonthAndSubject =
            student
                .records
                .find(record => record.month === month && record.subject.name === subject)
                ?.records
            || new Map<string, string>()

        return {
            name: subject,
            records: Object.fromEntries(recordsByMonthAndSubject)
        }
    })

}


export const getRecords = async (args: RecordsGetData, { res }: ExpressParams): Promise<Array<Records>> => {
   
    const { month, subjectID, groupID } = args

    const subjectDB = await subjectModel.findOne({ id: subjectID }).exec()
    const groupDB = await groupModel
                            .findOne({ id: groupID })
                            .populate({ path: "students", populate: { path: "records" }})
                            .exec()

    if (!subjectDB || !groupDB) {
        res.status(404)
        return
    }

    return groupDB.students
        .sort(sortByName)
        .map(({ name, records }: StudentModel) => {
            const recordsByMonthAndSubject =
                records
                    .find(r => r.month === month && r.subject.equals(subjectDB._id))
                    ?.records
                || new Map<string, string>()

            return {
                name,
                records: Object.fromEntries(recordsByMonthAndSubject)
            }
        })
}


export const setRecords = async (args: RecordsSetData, ep: ExpressParams): Promise<Array<Records>> => {
    await recordModel.createCollection()

    const { month, subjectID, groupID, entities } = args

    const subjectDB = await subjectModel.findOne({ id: subjectID }).exec()

    const recordsDB = await recordModel.find({ month, subject: subjectDB._id }).exec()

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    
    try {
        for (const entity of entities) {
            const student = await studentModel.findOne({ name: entity.name }).exec()
    
            let studentRecords = recordsDB.find(records => records.student.equals(student._id))
    
            if (!studentRecords) {
                studentRecords = new recordModel({
                    student,
                    subject: subjectDB,
                    month,
                    records: new Map<string, string>()
                })
            }

            for (const [day, record] of entity.records) {
                record
                    ? studentRecords.records.set(day, record)
                    : studentRecords.records.delete(day)
            }

            student.records.push(studentRecords._id)

            await studentRecords.save(opts)
            await student.save(opts)
        }

        await session.commitTransaction()
    
        return getRecords({ month, subjectID, groupID }, ep)
        
    } catch(err) {
        console.log(err)
		await session.abortTransaction()
		session.endSession()
		ep.res.status(500)
		return
    }
    
}