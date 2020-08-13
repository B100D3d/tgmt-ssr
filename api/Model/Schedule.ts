import {
    ScheduleGetData,
    Schedule,
    ScheduleModel,
    ScheduleCreatingData,
    ExpressParams,
    GroupModel,
    SubjectModel,
} from "../types"
import mongoose from "mongoose"
import groupModel from "./MongoModels/groupModel"
import subjectModel from "./MongoModels/subjectModel"
import scheduleModel from "./MongoModels/scheduleModel"
import { range } from "./Utils"
import { startSession } from "./mongodb"

const isNull = (v: any) => v === null

export const formatSchedule = (
    schedules: Array<ScheduleModel>,
    filter: { even?: boolean; subgroup?: number }
): Array<Schedule> => {
    const { even, subgroup } = filter

    const filteredSchedules = schedules
        .filter(({ even: e, subgroup: s }: ScheduleModel) =>
            isNull(even) && isNull(subgroup)
                ? true
                : isNull(even)
                ? s === subgroup
                : isNull(subgroup)
                ? e === even
                : s === subgroup && e === even
        )
        .map(({ weekdays }: ScheduleModel) => weekdays)

    const schedule: Array<Schedule> = []
    filteredSchedules.forEach((weekdays) => {
        weekdays.forEach((classNumbers, weekday) => {
            classNumbers.forEach((subject, classNumber) => {
                if (subject) {
                    const {
                        id,
                        name,
                        teacher: { name: teacher },
                    } = subject
                    schedule.push({
                        weekday,
                        classNumber,
                        subject: { id, name, teacher },
                    })
                }
            })
        })
    })
    return schedule
}

export const getSchedule = async (
    args: ScheduleGetData,
    { req, res }: ExpressParams,
    _?: any,
    session: mongoose.ClientSession = null
): Promise<Array<Schedule>> => {
    const { groupID: id } = args
    const groupDB = await groupModel
        .findOne({ id })
        .populate({
            path: "schedule",
            populate: {
                path: "weekdays",
                model: "Subject",
                populate: {
                    path: "teacher",
                },
            },
        })
        .session(session)
        .exec()

    if (!groupDB) {
        res.status(404)
        return
    }

    return formatSchedule(groupDB.schedule, args)
}

export const setSchedule = async (
    args: ScheduleCreatingData,
    { res, req }: ExpressParams
): Promise<Array<Schedule>> => {
    await scheduleModel.createCollection()

    const { groupID, even, subgroup, schedule } = args
    const group = await groupModel.findOne({ id: groupID }).exec()

    const conditions: any = { group: group._id }
    if (!isNull(even)) conditions.even = even
    if (!isNull(subgroup)) conditions.subgroup = subgroup

    const scheduleDB = await scheduleModel.find(conditions).exec()

    const subjectsIdsToDelete: Set<mongoose.Schema.Types.ObjectId> = new Set()

    const session = await startSession(req)
    session.startTransaction()
    const opts = { session }

    try {
        const subjectsId = Array.from(
            new Set(
                schedule
                    .filter(({ subjectID }) => subjectID !== "")
                    .map(({ subjectID }) => subjectID)
            )
        )
        let subjects: Record<string, SubjectModel> = {}
        for (const id of subjectsId) {
            subjects[id] = await subjectModel.findOne({ id }).exec()
        }

        for (const scheduleItem of schedule) {
            const { subjectID, weekday, classNumber } = scheduleItem

            const setSubject = (value: any) =>
                scheduleDB.forEach(({ weekdays }) => {
                    const oldSubject = weekdays[weekday][classNumber]
                    if (oldSubject) {
                        subjectsIdsToDelete.add(oldSubject)
                    }
                    weekdays[weekday][classNumber] = value
                })

            const subject = subjects[subjectID] || null
            if (subject) {
                group.subjects.addToSet(subject)
            }
            setSubject(subject)
        }

        deleteUnusedSubjects(group, scheduleDB, subjectsIdsToDelete)

        for (const schedule of scheduleDB) {
            await scheduleModel.updateOne({ _id: schedule._id }, schedule, opts)
        }
        await group.save(opts)
        await session.commitTransaction()
        session.endSession()

        return getSchedule(
            { groupID, even, subgroup },
            { res, req },
            null,
            session
        )
    } catch (err) {
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
    schedules.forEach(({ weekdays }) => {
        weekdays.forEach((weekday) => {
            weekday.forEach((subject) => {
                subject && deletedSubjects.delete(subject._id)
            })
        })
    })
    deletedSubjects.forEach((id) => group.subjects.pull(id))
}

export const getDefaultSchedule = (group: GroupModel) =>
    range(4).map(
        (i) =>
            new scheduleModel({
                group,
                even: i % 2,
                subgroup: i < 2 ? 1 : 2,
            })
    )
