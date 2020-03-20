import mongoose from "mongoose"
import argon2 from "argon2"
import jwt from "jsonwebtoken"
import { UserModel } from "../../types";

const userSchema = new mongoose.Schema({
    login: String,
    hash: String,
    name: String,
    role: String,
    email: String,
    fingerprints: Array,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher"
    }
})


userSchema.methods.setPassword = async function(password: string): Promise<void> {

    this.hash = await argon2.hash(password);

};


userSchema.methods.isPasswordValid = async function(password: string): Promise<boolean> {

    const isValid = await argon2.verify(this.hash, password);

    return isValid;
};

userSchema.methods.generateJWT = function(): string {

    return jwt.sign({
        uniqueId: this._id
    }, process.env.SECRET);

};

export default mongoose.model<UserModel>("User", userSchema);