import mongoose from "mongoose";
import { TeacherModel } from "../../types";

const teacherSchema = new mongoose.Schema({
    id: String,
    name: String,
    subjects: [{type: mongoose.Schema.Types.ObjectId, ref: "Subject"}]
});

export default mongoose.model<TeacherModel>("Teacher", teacherSchema);
