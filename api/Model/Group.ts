import {
    Group,
    GroupModel,
    GroupCreatingData,
    ExpressParams,
    CreatedGroup,
    GroupID,
    GroupChangingData
} from "../types"
import mongoose from "mongoose"
import groupModel from "./MongoModels/groupModel"
import { generateGroupID, sortByName } from "./Utils"
import studentModel from "./MongoModels/studentModel"
import scheduleModel from "./MongoModels/scheduleModel"
import userModel from "./MongoModels/userModel"
import recordsModel from "./MongoModels/recordsModel"
import { getDefaultSchedule } from "./Schedule"


export const getGroups = async (): Promise<Array<Group>> => {

    const groupsDB = await groupModel.find().exec()

    const groups = groupsDB
        .sort(sortByName)
        .map(
        ({ id, name, year }: GroupModel) =>
        ({ id, name, year })
    )

    return groups
}


export const createGroup = async ({ name, year }: GroupCreatingData, { res }: ExpressParams): Promise<CreatedGroup | null> => {
    await groupModel.createCollection()

    const id = generateGroupID(name)

    const groupData = { id, name, year }
    const group = new groupModel(groupData)
    const schedule = getDefaultSchedule(group)

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
        for (const s of schedule) {
            group.schedule.addToSet(s._id)
            await s.save(opts)
        }
        await group.save(opts)
        await session.commitTransaction()

        return groupData
    } catch (err) {
        console.log(`Group didn't saved: \n ${err}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}

export const deleteGroup = async ({ groupID: id }: GroupID, { res }: ExpressParams): Promise<boolean> => {
    
    const group = await groupModel.findOne({ id }).exec()

    if(!group) {
        console.log("Group not found")
        res.status(404)
        return
    }

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try{
        const students = await studentModel.find({ group: group._id }).exec()
        for (const student of students) {
            await userModel.deleteOne({ student: student._id }, opts).exec()
            await studentModel.deleteOne({ _id: student._id }, opts).exec()
            await recordsModel.deleteMany({ student: student._id }, opts).exec()
        }
        await scheduleModel.deleteMany({ group: group._id }, opts).exec()
        await groupModel.deleteOne({ _id: group._id }, opts).exec()
        await session.commitTransaction()
        return true
    } catch(err) {
        console.log(`Group not deleted: ${err}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
    
}


export const changeGroup = async ({ groupID, name, year }: GroupChangingData, { res }: ExpressParams): Promise<CreatedGroup> => {

    const group = await groupModel.findOne({ id: groupID }).exec()

    const id = generateGroupID(name)
    const groupData = { id, name, year }

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
        await group.updateOne(groupData, opts).exec()
        await session.commitTransaction()
        return  groupData
    } catch (e) {
        console.log(`Group didn't changed: \n ${e}`)
        await session.abortTransaction()
        session.endSession()
        res.status(500)
        return
    }
}