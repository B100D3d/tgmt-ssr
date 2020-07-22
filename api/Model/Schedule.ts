import {
    ScheduleGetData,
    Schedule,
    ScheduleModel,
    ScheduleCreatingData,
    ExpressParams,
    GroupModel, SubjectModel
} from "../types"
import mongoose from "mongoose"
import groupModel from "./MongoModels/groupModel"
import subjectModel from "./MongoModels/subjectModel"
import scheduleModel, { CLASS_NUMBERS } from "./MongoModels/scheduleModel"
import subject from "../graphql/schemas/types/subject";
import {range} from "./Utils";

const isNull = (v: any) => v === null


export const getSchedule = async (
    args: ScheduleGetData,
    { res }: ExpressParams
): Promise<Array<Schedule>> => {
    const { groupID: id, even, subgroup } = args

    const groupDB = await groupModel
                            .findOne({ id })
                            .populate({
                                path: "schedule",
                                populate: {
                                    path: "weekdays",
                                    model: "Subject",
                                    populate: {
                                        path: "teacher"
                                    }
                                }
                            })
                            .exec()
    
    if(!groupDB) {
        res.status(404)
        return
    }

    console.time("get schedule")
    const schedules = groupDB
        .schedule
        .filter(({ even: e, subgroup: s }: ScheduleModel) => (isNull(even) && isNull(subgroup)) ? true
                                                                : (isNull(even)) ? s === subgroup
                                                                : (isNull(subgroup)) ? e === even
                                                                : s === subgroup && e === even
        )
        .map(({ weekdays }: ScheduleModel) => weekdays)


    const schedule: Array<Schedule> = []
    schedules.forEach(weekdays => {
        weekdays.forEach((classNumbers, weekday) => {
            classNumbers.forEach(
                (subject, classNumber) =>
                {
                    if(subject) {
                        const { id, name, teacher: { name: teacher } } = subject
                        schedule.push({
                            weekday,
                            classNumber,
                            subject: { id, name, teacher }
                        })
                    }
                })
        })
    })
    console.timeEnd("get schedule")
    return schedule
}

export const setSchedule = async (
    args: ScheduleCreatingData,
    { res, req }: ExpressParams
): Promise<Array<Schedule>> => {
    await scheduleModel.createCollection()

    const { groupID, even, subgroup, schedule } = args

    const group = await groupModel.findOne({ id: groupID }).populate({
        path: "schedule",
        populate: {
            path: "subject"
        }
    }).exec()

    const scheduleDB = group.schedule.filter(
        ({ even: e, subgroup: s }: ScheduleModel) => isNull(even) && isNull(subgroup) ? true
                                                    : isNull(even) ? s === subgroup
                                                    : isNull(subgroup) ? e === even
                                                    : s === subgroup && e === even
    )

    const subjectsIdsToDelete: Set<mongoose.Schema.Types.ObjectId> = new Set()
    
    const session = await mongoose.startSession()
    session.startTransaction()
	const opts = { session }

	try {
        console.time("get subjects")
        const subjectsId = Array.from(new Set(
            schedule
                .filter(({ subjectID }) => subjectID !== "")
                .map(({ subjectID }) => subjectID)))
        let subjects: Record<string, SubjectModel> = {}
        for (const id of subjectsId) {
            subjects[id] = await subjectModel.findOne({ id }).exec()
        }
        console.timeEnd("get subjects")
        console.time("setting schedule")
		for (const scheduleItem of schedule) {

			const { subjectID, weekday, classNumber } = scheduleItem

			if(subjectID) {
                console.time("get subject")
				const subject = subjects[subjectID]
				group.subjects.addToSet(subject._id)
                console.timeEnd("get subject")
                console.time("add schedule item")
				scheduleDB.forEach(({ weekdays }) => {
				    if(weekdays[weekday][classNumber]) {
				        subjectsIdsToDelete.add(weekdays[weekday][classNumber])
                    }
                    weekdays[weekday][classNumber] = subject._id
                })
                console.timeEnd("add schedule item")
			} else {
                console.time("delete schedule item")
			    scheduleDB.forEach(({ weekdays }) => {
                    if(weekdays[weekday][classNumber]) {
                        subjectsIdsToDelete.add(weekdays[weekday][classNumber])
                    }
                    weekdays[weekday][classNumber] = null
			    })
                console.timeEnd("delete schedule item")
			}
		}

		deleteUnusedSubjects(group, scheduleDB, subjectsIdsToDelete)
        console.timeEnd("setting schedule")
        console.time("save in database")
        for (const schedule of scheduleDB) {
            await scheduleModel.updateOne({ _id: schedule._id }, schedule, opts )
        }
		await group.save(opts)
		await session.commitTransaction()
        console.timeEnd("save in database")
		return getSchedule({ groupID, even, subgroup }, { res, req })
	} catch(err) {
		console.log(err)
		await session.abortTransaction()
		session.endSession()
		res.status(500)
		return
	}
}

const deleteUnusedSubjects = (
    group: GroupModel,
    schedules: Array<ScheduleModel>,
    deletedSubjects: Set<mongoose.Schema.Types.ObjectId>
): void => {
    console.time("deleteSubjects")
    schedules.forEach(({ weekdays }) => {
        weekdays.forEach(weekday => {
            weekday.forEach(subject => {
                subject && deletedSubjects.delete(subject._id)
            })
        })
    })
    deletedSubjects.forEach(id => group.subjects.pull(id))
    console.timeEnd("deleteSubjects")
}

export const getDefaultSchedule = (group: GroupModel) =>
    range(4).map(i => new scheduleModel({
        group,
        even: i % 2,
        subgroup: i < 2 ? 1 : 2
    }))
