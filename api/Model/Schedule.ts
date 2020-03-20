import { 
    ScheduleGetData, 
    Schedule, 
    ScheduleModel,
    ScheduleCreatingData,
    ExpressParams,
    GroupModel,
    SubjectModel
} from "../types"
import groupModel from "./MongoModels/groupModel"
import subjectModel from "./MongoModels/subjectModel"
import scheduleModel from "./MongoModels/scheduleModel"



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
        .filter(({ even: e, subgroup: s }: ScheduleModel) => (!even && !subgroup) ? true 
                                                                : (!even) ? s === subgroup
                                                                : (!subgroup) ? e === even
                                                                : s === subgroup && e === even
        )
        .reduce((acc, curr) => {
            const { weekday, classNumber } = curr
            const exist = acc.find(s => (s.weekday === weekday && s.classNumber === classNumber))
            if(!exist) {
                acc.push({ weekday, classNumber })
            }
            return acc
        }, [])
        .map(({ weekday, classNumber }: ScheduleModel) => 
            groupDB.schedule.find(s => s.weekday === weekday && s.classNumber === classNumber))
        .map(
            ({ weekday, classNumber, subject: { id, name, teacher: { name: teacherName }}}: ScheduleModel) =>
            ({ weekday, classNumber, subject: { id, name, teacher: teacherName }})
        )
                    
    return schedule
}

const createSchedule = async (
    existingSchedule: ScheduleModel[], 
    group: GroupModel,
    subject: SubjectModel,
    weekday: number,
    classNumber: number, 
    even?: boolean, 
    subgroup?: number
    ): Promise<void> => {

    const subjectsIdToFind = Array.from(new Set(existingSchedule.map(s => s.subject._id)))
    const defaultData = { subject: subject._id }
    const schedulesData = [
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
    const data = (!even && !subgroup) ? schedulesData 
                            : (!even) ? schedulesData.filter(val => val.subgroup === subgroup)
                            : (!subgroup) ? schedulesData.filter(val => val.even === even)
                            : schedulesData.filter(val => (val.even === even && val.subgroup === subgroup))

    const schedulesLength = (!even && !subgroup) ? 4
                          : (!even || !subgroup) ? 2
                          :                        1

    while(existingSchedule.length < schedulesLength) {
        const schedule = new scheduleModel({
            classNumber,
            weekday,
            group
        })
        existingSchedule.push(schedule)
        group.schedule.addToSet(schedule._id)
        await schedule.save()
    }

    for (const [i, val] of existingSchedule.entries()) {
        await scheduleModel.updateOne({ _id: val._id }, { ...defaultData, ...data[i] }).exec()
    }

    for(const id of subjectsIdToFind) {
        const scheduleForSubject = await scheduleModel.findOne({ group: group._id, subject: id }).exec()
        if (!scheduleForSubject) {
            group.subjects.pull(id)
        }
    }
    
}

const deleteSchedule = async (existingSchedule: ScheduleModel[], group: GroupModel): Promise<void> => {
    const subjectToFind = existingSchedule[0].subject

    for (const schedule of existingSchedule) {
        group.schedule.pull({ _id: schedule._id })
        await schedule.remove()
    }
    
    const scheduleForSubject = group.schedule.find(
        ({ subject }: ScheduleModel) => subject._id.equals(subjectToFind._id)
    )

    if (!scheduleForSubject) {
        group.subjects.pull(subjectToFind._id)
    }
}


export const setSchedule = async (args: ScheduleCreatingData, { res }: ExpressParams): Promise<Array<Schedule>> => {
    const { groupID, even, subgroup, schedule } = args

    const group = await groupModel.findOne({ id: groupID }).populate({
        path: "schedule",
        populate: {
            path: "subject"
        }
    }).exec()

    const schedules = group.schedule.filter(
        ({ even: e, subgroup: s }: ScheduleModel) => (!even && !subgroup) ? true 
                                                    : (!even) ? s === subgroup
                                                    : (!subgroup) ? e === even
                                                    : s === subgroup && e === even
    )

    for (const item of schedule) {

        const { subjectID, weekday, classNumber } = item

        const existingSchedule = schedules.filter(
            ({ weekday: w, classNumber: c }: ScheduleModel) => (w === weekday && c === classNumber)
        )

        try {
            if(subjectID) {
                const subject = await subjectModel.findOne({ id: subjectID }).exec()
                group.subjects.addToSet(subject._id)

                await createSchedule(existingSchedule, group, subject, weekday, classNumber, even, subgroup)
            } else {
                if(existingSchedule.length) {
                    await deleteSchedule(existingSchedule, group)
                }
            }

        } catch(err) {
            console.log(err)
            res.status(500)
            return
        }
    }

    await group.save()

    const scheduleDB = await scheduleModel
                            .find({ group: group._id })
                            .populate({ path: "subject", populate: { path: "teacher" }})
                            .exec()

    return scheduleDB
                .filter(({ even: e, subgroup: s }: ScheduleModel) => (!even && !subgroup) ? true 
                                                                        : (!even) ? s === subgroup
                                                                        : (!subgroup) ? e === even
                                                                        : s === subgroup && e === even
                )
                .reduce((acc, curr) => {
                    const { weekday, classNumber } = curr
                    const exist = acc.find(s => (s.weekday === weekday && s.classNumber === classNumber))
                    if(!exist) {
                        acc.push({ weekday, classNumber })
                    }
                    return acc
                }, [])
                .map(({ weekday, classNumber }: ScheduleModel) => 
                    scheduleDB.find(s => s.weekday === weekday && s.classNumber === classNumber))
                .map(
                    ({ weekday, classNumber, subject: { id, name, teacher: { name: teacherName }}}: ScheduleModel) =>
                    ({ weekday, classNumber, subject: { id, name, teacher: teacherName }})
                )
}