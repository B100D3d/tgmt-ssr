import mongoose from "mongoose"
import { RecordsModel } from "../../types"


const recordsSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    month: Number, // 0-11
    records: {
        type: Map,
        of: String
    } // [оценки/пропуски за месяц] { day: String, value: string }
});

export default mongoose.model<RecordsModel>("Records", recordsSchema)