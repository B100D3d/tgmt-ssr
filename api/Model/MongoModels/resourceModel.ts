import mongoose from "mongoose";
import { ResourceModel } from "../../types";

const resourceSchema = new mongoose.Schema({
    img: String,
    text: String,
    url: String
});

export default mongoose.model<ResourceModel>("Resource", resourceSchema);