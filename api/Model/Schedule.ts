import { 
    ScheduleGetData, 
    Schedule, 
    ScheduleModel,
    ScheduleCreatingData,
    ExpressParams,
    GroupModel,
    SubjectModel
} from "../types"
import mongoose, { Schema, ClientSession } from "mongoose"
import groupModel from "./MongoModels/groupModel"
import subjectModel from "./MongoModels/subjectModel"
import scheduleModel from "./MongoModels/scheduleModel"

const isNull = (v: any) => v === null

const SCHEDULE_DATA: Array<{ even: boolean; subgroup: number }> = [
    {
        even: true,
        subgroup: 1
    },
    {
        even: true,
        subgroup: 2
    },
    {
        even: false,
        subgroup: 1
    },
    {
        even: false,
        subgroup: 2
    }
]


export const getSchedule = async (args: ScheduleGetData, { res }: ExpressParams): Promise<Array<Schedule>> => {
    const { groupID: id, even, subgroup } = args

    const groupDB = await groupModel
                            .findOne({ id })
                            .populate({
                                path: "schedule",
                                populate: {
                                    path: "subject",
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


    const schedule = groupDB.schedule
        .filter(({ even: e, subgroup: s }: ScheduleModel) => (isNull(even) && isNull(subgroup)) ? true
                                                                : (isNull(even)) ? s === subgroup
                                                                : (isNull(subgroup)) ? e === even
                                                                : s === subgroup && e === even
        )
        .map(
            ({ weekday, classNumber, subject: { id, name, teacher: { name: teacherName }}}: ScheduleModel) =>
            ({ weekday, classNumber, subject: { id, name, teacher: teacherName }})
        )
                    
    return schedule
}

const deleteUnusedSubjects = async (subjectsId: Array<Schema.Types.ObjectId & SubjectModel>, group: GroupModel): Promise<void> => {
    for(const id of subjectsId) {
        const scheduleForSubject = await scheduleModel.findOne({ group: group._id, subject: id }).exec()
        if (!scheduleForSubject) {
            group.subjects.pull(id)
        }
    }
}

const createSchedule = async (
    schedules: ScheduleModel[],
    group: GroupModel,
    subject: SubjectModel,
    weekday: number,
    classNumber: number, 
    scheduleData: Array<{ even: boolean; subgroup: number }>, 
	scheduleLength: number,
	opts: Record<string, ClientSession>
    ): Promise<void> => {

    const existingSchedule = schedules.filter(
        ({ weekday: w, classNumber: c }: ScheduleModel) => (w === weekday && c === classNumber)
    )

    const subjectsIdToFind = Array.from(new Set(existingSchedule.map(s => s.subject._id)))
    const defaultData = { subject: subject._id }

    while(existingSchedule.length < scheduleLength) {
        const schedule = new scheduleModel({
            classNumber,
            weekday,
            group
        })
        existingSchedule.push(schedule)
        schedules.push()
        group.schedule.addToSet(schedule._id)
        await schedule.save(opts)
    }

    for (const [i, val] of existingSchedule.entries()) {
        await scheduleModel.updateOne({ _id: val._id }, { ...defaultData, ...scheduleData[i] }, opts).exec()
    }

    await deleteUnusedSubjects(subjectsIdToFind, group)
    
}

const deleteSchedule = async (
	schedules: ScheduleModel[],
	weekday: number,
	classNumber: number,
	group: GroupModel, 
	opts: Record<string, ClientSession>
	): Promise<void> => {

    const existingSchedule = schedules.filter(
        ({ weekday: w, classNumber: c }: ScheduleModel) => (w === weekday && c === classNumber)
    )

    if(existingSchedule.length) {
        const subjectsIdToFind = Array.from(new Set(existingSchedule.map(s => s.subject._id)))

        for (const schedule of existingSchedule) {
            group.schedule.pull({ _id: schedule._id })
            await scheduleModel.deleteOne({ _id: schedule._id }, opts)
        }

        await deleteUnusedSubjects(subjectsIdToFind, group)
    }
}


export const setSchedule = async (args: ScheduleCreatingData, { res }: ExpressParams): Promise<Array<Schedule>> => {
    await scheduleModel.createCollection()

    const { groupID, even, subgroup, schedule } = args

    const group = await groupModel.findOne({ id: groupID }).populate({
        path: "schedule",
        populate: {
            path: "subject"
        }
    }).exec()

    const schedules = group.schedule.filter(
        ({ even: e, subgroup: s }: ScheduleModel) => (isNull(even) && isNull(subgroup)) ? true
                                                    : (isNull(even)) ? s === subgroup
                                                    : (isNull(subgroup)) ? e === even
                                                    : s === subgroup && e === even
    )

    const scheduleData = (isNull(even) && isNull(subgroup)) ? SCHEDULE_DATA
                            : (isNull(even)) ? SCHEDULE_DATA.filter(val => val.subgroup === subgroup)
                            : (isNull(subgroup)) ? SCHEDULE_DATA.filter(val => val.even === even)
                            : SCHEDULE_DATA.filter(val => (val.even === even && val.subgroup === subgroup))

    const scheduleLength =  (isNull(even) && isNull(subgroup)) ?  4
                          : (isNull(even) || isNull(subgroup)) ?  2
                          :                                       1
    
    const session = await mongoose.startSession()
    session.startTransaction()
	const opts = { session }
	
	try {
		for (const item of schedule) {

			const { subjectID, weekday, classNumber } = item
	
			if(subjectID) {
				const subject = await subjectModel.findOne({ id: subjectID }).exec()
				group.subjects.addToSet(subject._id)

				await createSchedule(schedules, group, subject, weekday, classNumber, scheduleData, scheduleLength, opts)
			} else {
                await deleteSchedule(schedules, weekday, classNumber, group, opts)
			}
		}
	
		await group.save(opts)
		await session.commitTransaction()
	
		const scheduleDB = await scheduleModel
								.find({ group: group._id })
								.populate({ path: "subject", populate: { path: "teacher" }})
								.exec()

		return scheduleDB
					.filter(({ even: e, subgroup: s }: ScheduleModel) => (isNull(even) && isNull(subgroup)) ? true
																			: (isNull(even)) ? s === subgroup
																			: (isNull(subgroup)) ? e === even
																			: s === subgroup && e === even
					)
					.map(
						({ weekday, classNumber, subject: { id, name, teacher: { name: teacherName }}}: ScheduleModel) =>
						({ weekday, classNumber, subject: { id, name, teacher: teacherName }})
					)
	} catch(err) {
		console.log(err)
		await session.abortTransaction()
		session.endSession()
		res.status(500)
		return
	}
    
}