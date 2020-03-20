import { 
    Group, 
    GroupModel, 
    GroupCreatingData, 
    ExpressParams, 
    CreatedGroup 
} from "../types"
import groupModel from "./MongoModels/groupModel"
import { generateGroupID } from "./Utils"
import studentModel from "./MongoModels/studentModel"
import scheduleModel from "./MongoModels/scheduleModel"



export const getGroups = async (): Promise<Array<Group>> => {

    const groupsDB = await groupModel.find().exec()

    const groups = groupsDB.map(
        ({ id, name, year }: GroupModel) =>
        ({ id, name, year })
    )

    return groups
}


export const createGroup = async ({ name, year }: GroupCreatingData, { res }: ExpressParams): Promise<CreatedGroup | null> => {
    const id = generateGroupID(name)

    const groupData = { id, name, year }
    const group = new groupModel(groupData)

    try {
        await group.save()

        return groupData

    } catch (err) {
        console.log(`Group didn't saved: \n ${err}`)
        res.status(500)
        return
    }
}

export const deleteGroup = async ({ name, year }: GroupCreatingData, { res }: ExpressParams): Promise<boolean> => {
    
    const group = await groupModel.findOne({ name, year }).exec()
    try{
        await studentModel.deleteMany({ group: group._id }).exec()
        await scheduleModel.deleteMany({ group: group._id }).exec()
        await group.remove()
        return true
    } catch(err) {
        console.log(`Group not deleted: ${err}`)
        res.status(500)
        return
    }
    
}