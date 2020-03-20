import mongoose from "mongoose";
import { AbsenceModel } from "../../types";


const absenceSchema = new mongoose.Schema({
    date: Date,
    absence: [Number]
});

export default mongoose.model<AbsenceModel>("Absence", absenceSchema);