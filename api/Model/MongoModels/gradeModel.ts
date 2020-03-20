import mongoose from "mongoose"
import { GradesModel } from "../../types"


const gradesSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    month: Number, // 0-11
    grades: {
        type: Map,
        of: Number
    } // [оценки за месяц] { day: String, grade: Number }
});

export default mongoose.model<GradesModel>("Grades", gradesSchema)