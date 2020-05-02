import {
    Group,
    GroupModel,
    GroupCreatingData,
    ExpressParams,
    CreatedGroup, GroupID
} from "../types"
import mongoose from "mongoose"
import groupModel from "./MongoModels/groupModel"
import { generateGroupID } from "./Utils"
import studentModel from "./MongoModels/studentModel"
import scheduleModel from "./MongoModels/scheduleModel"
import userModel from "./MongoModels/userModel";



export const getGroups = async (): Promise<Array<Group>> => {

    const groupsDB = await groupModel.find().exec()

    const groups = groupsDB
        .sort((a, b) => a.name > b.name ? 1 : -1)
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

    const session = await mongoose.startSession()
    session.startTransaction()
    const opts = { session }
    try {
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