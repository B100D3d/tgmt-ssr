import mongoose from "mongoose";
import { SubjectModel } from "../../types";


const subjectSchema = new mongoose.Schema({
    id: String,
    name: String,
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }
});

export default mongoose.model<SubjectModel>("Subject", subjectSchema);
