import mongoose from "mongoose"
import { ScheduleModel } from "../../types"
import { range } from "../Utils"

export const WEEKDAYS = 7
export const CLASS_NUMBERS = 7

const scheduleSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    },
    even: Boolean,
    subgroup: Number,
    weekdays: {
        type: [
            [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
        ],
        default: range(WEEKDAYS).map(() => [...Array(CLASS_NUMBERS)])
    }
})

export default mongoose.model<ScheduleModel>("Schedule", scheduleSchema)
