import mongoose from "mongoose";
import { GroupModel } from "../../types";


const groupSchema = new mongoose.Schema({
    id: String,
    name: String,
    students: [{type: mongoose.Schema.Types.ObjectId, ref: "Student"}],
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: "Subject"}],
    schedule: [{type: mongoose.Schema.Types.ObjectId, ref: "Schedule"}],
    year: Number
});

export default mongoose.model<GroupModel>("Group", groupSchema);