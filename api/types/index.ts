import { Schema, Document, Types } from "mongoose";
import { Request, Response } from "express"

export interface ExpressParams {
    res: Response;
    req: Request;
}

export interface TokenInfo {
    uniqueId: string;
}

export interface UserRegData {
    name: string;
    login: string;
    password: string;
    role: string;
    email: string;
}

export interface StudentRegData extends UserRegData {
    group: string;
}

export interface UserCreatingData {
    name: string;
    email: string;
}

export interface AdminCreatingData extends UserCreatingData {
    login: string;
    password: string;
}

export interface StudentCreatingData extends UserCreatingData {
    group: string;
}

export interface StudentChangedData {
    studentID: string;
    data: {
        name?: string;
        email?: string;
        groupID?: string;
    };
}


export interface GroupCreatingData {
    name: string;
    year: number;
}

export interface CreatedGroup extends GroupCreatingData {
    id: string;
}

export interface SubjectGetData {
    groupID: string;
}

export interface SubjectData {
    name: string;
    teacher: string;
}

export interface RecordsGetData {
    month: number;
    groupID?: string;
    subjectID?: string;
}

export interface RecordsSetData extends RecordsGetData {
    records: {
        student: string;
        records: Array<Record>;
    }[];
}

export interface ScheduleGetData {
    groupID: string;
    even?: boolean;
    subgroup?: number;
}
export interface ScheduleCreatingData extends ScheduleGetData {
    schedule: Array<{
        subjectID: string;
        weekday: number;
        classNumber: number;
    }>;
}

export interface CreatedSubject extends SubjectData {
    id: string;
}

export interface User {
    login: string;
    hash?: string;
    name: string;
    role: string;
    email: string;
    fingerprints: Array<string>;
    student?: Schema.Types.ObjectId & StudentModel;
    teacher?: Schema.Types.ObjectId & TeacherModel;
}

export interface UserModel extends User, Document {
    setPassword(pass: string): Promise<void>;
    isPasswordValid(pass: string): Promise<boolean>;
    isFingerprintValid(fingerprint: string): boolean;
    generateJWT(): string;
}

export interface StudentModel extends Document {
    id: string;
    name: string;
    records: Types.Array<Schema.Types.ObjectId & RecordsModel>;
    group: Schema.Types.ObjectId & GroupModel;
}


export interface TeacherModel extends Document {
    id: string;
    name: string;
    subjects: Types.Array<Schema.Types.ObjectId & SubjectModel>;
}

export interface SubjectModel extends Document {
    id: string;
    name: string;
    teacher: Schema.Types.ObjectId & TeacherModel;
}

export interface ResourceModel extends Document {
    img: string;
    text: string;
    url: string;
}

export interface RecordsModel extends Document {
    student: Schema.Types.ObjectId & StudentModel;
    subject: Schema.Types.ObjectId & SubjectModel;
    month: number;
    records: Map<string, string>;
}

export interface GroupModel extends Document {
    id: string;
    name: string;
    students: Types.Array<Schema.Types.ObjectId & StudentModel>;
    subjects: Types.Array<Schema.Types.ObjectId & SubjectModel>;
    schedule: Types.Array<Schema.Types.ObjectId & ScheduleModel>;
    year: number;
}

export interface ScheduleModel extends Document {
    classNumber: number;
    weekday: number;
    even?: boolean;
    subgroup?: number;
    subject: Schema.Types.ObjectId & SubjectModel;
    group: Schema.Types.ObjectId & GroupModel;
}

export interface Admin {
    name: string;
    role: string;
    email: string;
    groups: Group[];
}

export interface Teacher {
    id?: string;
    name: string;
    email: string;
    role?: string;
    subjects?: Subject[];
    groups?: Group[];
}

export interface Student {
    id?: string;
    name: string;
    role?: string;
    email: string;
    group: Group;
    schedule?: Array<Schedule>;
}

export interface Group {
    id?: string;
    name: string;
    students?: Student[];
    subjects?: Subject[];
    schedule?: Schedule[];
    year: number;
}

export interface Schedule {
    subject: Subject;
    classNumber: number;
    weekday: number;
}

export interface Subject {
    id: string;
    name?: string;
    teacher?: string;
}

export interface Records {
    entity: string;
    records: Array<Record>;
}

export interface Record {
    day: number;
    record?: string;
}

export interface Login {
    login: string;
}

export interface LoginInfo extends Login {
    password: string;
}

export interface PasswordsInfo {
    oldPassword: string;
    newPassword: string;
}

export interface Week {
    date: string;
    even: string;
    weekNum: number;
}

export interface Res {
    img: string;
    text: string;
    url: string;
}

export interface Email {
    email: string;
}