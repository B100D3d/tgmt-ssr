import { 
    RecordsGetData, 
    ExpressParams,
    Records,
    RecordsSetData,
    Record,
    StudentModel,
    SubjectModel
} from "../types"
import mongoose from "mongoose"
import userModel from "./MongoModels/userModel"
import studentModel from "./MongoModels/studentModel"
import recordModel from "./MongoModels/recordsModel"
import subjectModel from "./MongoModels/subjectModel"
import groupModel from "./MongoModels/groupModel"

const getRecordsArrayFromMap = (entity: string, _records: Map<string, string>): Records => {

    const records: Array<Record> = []
    for (const day of _records.keys()) {
        const record = {
            day: +day,
            record: _records.get(day)
        }

        records.push(record)
    }

    return { entity, records }
}

export const getStudentRecords = async ({ month }: RecordsGetData, { req }: ExpressParams): Promise<Array<Records>> => {

    const { uniqueId } = req.uniqueId

    const user = await userModel.findById(uniqueId).exec()

    const student = await studentModel
                            .findOne({ name: user.name })
                            .populate({ path: "records group", populate: { path: "subject subjects" }})
                            .exec()

    const subjects = student.group.subjects.map(({ name }: SubjectModel) => name)

    const records = subjects.map(subject => {
        const recordsByMonthAndSubject = 
            student.records.find(record => record.month === month && record.subject.name === subject)
            || { records: new Map<string, string>() }
                                
        const records = getRecordsArrayFromMap(subject, recordsByMonthAndSubject.records)

        return records
    })

    return records

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

    const records = groupDB.students
        .sort((a, b) => a.name > b.name ? 1 : -1)
        .map(({ name: entity, records: _records }: StudentModel) => {
            const recordsByMonthAndSubject =
                _records.find(g => g.month === month && g.subject.equals(subjectDB._id))
                || { records: new Map<string, string>()}

            const records = getRecordsArrayFromMap(entity, recordsByMonthAndSubject.records)

            return records
        })

    return records
}


export const setRecords = async (args: RecordsSetData, ep: ExpressParams): Promise<Array<Records>> => {
    
    const { month, subjectID, groupID, records } = args

    const subjectDB = await subjectModel.findOne({ id: subjectID }).exec()

    const recordsDB = await recordModel.find({ month, subject: subjectDB._id })

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    
    try {
        for (const item of records) {
            const student = await studentModel.findOne({ name: item.student }).exec()
    
            let studentRecords = recordsDB.find(records => records.student.equals(student._id))
    
            if (!studentRecords) {
                studentRecords = new recordModel({
                    student,
                    subject: subjectDB,
                    month,
                    records: new Map<string, string>()
                })
            }
    
            item.records.map(record => {
                record.record 
                    ? studentRecords.records.set(record.day.toString(), record.record) 
                    : studentRecords.records.delete(record.day.toString())
            })

            student.records.push(studentRecords._id)
            await studentRecords.save(opts)
            await student.save(opts)
            await session.commitTransaction()
    
        }
    
        return getRecords({ month, subjectID, groupID }, ep)
        
    } catch(err) {
        console.log(err)
		await session.abortTransaction()
		session.endSession()
		ep.res.status(500)
		return
    }
    
}