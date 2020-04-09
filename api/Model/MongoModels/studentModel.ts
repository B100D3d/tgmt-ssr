import mongoose from "mongoose";
import { StudentModel } from "../../types";


const studentSchema = new mongoose.Schema({
    id: String,
    name: String,
    records: [{type: mongoose.Schema.Types.ObjectId, ref: "Records", default: []}], // оценки по месяцам
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group"
    }
});

export default mongoose.model<StudentModel>("Student", studentSchema);
