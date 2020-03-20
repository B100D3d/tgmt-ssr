import mongoose from "mongoose";
import { ScheduleModel } from "../../types";


const scheduleSchema = new mongoose.Schema({
    classNumber: Number,
    weekday: Number,
    even: Boolean,
    subgroup: Number,
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
});

export default mongoose.model<ScheduleModel>("Schedule", scheduleSchema);
