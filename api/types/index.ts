import {Schema, Document, Types, ClientSession} from "mongoose";
import { Request, Response } from "express"
import exp from "constants";

export interface ExpressParams {
    res: Response;
    req: Request;
}

export interface TokenInfo {
    uniqueId: string;
}

export interface UserName {
    name: string;
}

export interface UserRegData extends UserName{
    login: string;
    password: string;
    role: string;
    email: string;
}

export interface StudentRegData extends UserRegData {
    group: string;
}

export interface UserCreatingData extends UserName{
    email: string;
}

export interface AdminCreatingData extends UserCreatingData {
    login: string;
    password: string;
}

export interface StudentCreatingData extends UserCreatingData {
    group: string;
}

export interface StudentID {
    studentID?: string;
}

export interface StudentsGetData extends StudentID {
    studentsID?: Array<string>;
    groupsID?: Array<string>;
}

export interface StudentChangedData extends StudentID{
    data: {
        name?: string;
        email?: string;
        groupID?: string;
    };
}

export interface TeacherID {
    teacherID?: string;
}

export interface TeachersGetData extends TeacherID {
    teachersID?: Array<string>;
}

export interface TeacherChangedData extends TeacherID{
    data: {
        name?: string,
        email?: string
    };
}

export interface GroupCreatingData {
    name: string;
    year: number;
}

export interface GroupChangingData extends  GroupCreatingData, GroupID {}

export interface GroupID {
    groupID?: string;
}

export interface CreatedGroup extends GroupCreatingData {
    id: string;
}

export interface SubjectData {
    name: string;
    teacher: string;
}

export interface SubjectID {
    subjectID: string;
}

export interface SubjectChangingData extends SubjectData, SubjectID {}

export interface SubjectGettingData extends SubjectID, GroupID {}

export interface RecordsGetData {
    month: number;
    groupID?: string;
    subjectID?: string;
}

export interface RecordsSetData extends RecordsGetData {
    entities: {
        name: string;
        records: Array<Array<string>>
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

export interface User extends Email {
    login: string;
    hash?: string;
    name: string;
    role: string;
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

export interface UserInfo extends Login, Email, ChangingPassword { }

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
    group: Schema.Types.ObjectId & GroupModel;
    even: boolean;
    subgroup: number;
    weekdays: Array<Array<Schema.Types.ObjectId & SubjectModel>>
}

export interface Admin {
    login?: string;
    name: string;
    role: string;
    email: string;
    groups: Group[];
}

export interface Teacher extends Email {
    login?: string;
    id?: string;
    name: string;
    role?: string;
    subjects?: Subject[];
    groups?: Group[];
}

export interface Student extends Email {
    login?: string;
    id?: string;
    name: string;
    role?: string;
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
    name: string;
    records: { [key: string]: string };
}

export type MailingType = "All" | "Groups" | "Students" | "Teachers"
export interface Mailing {
    type: MailingType;
    entities: Array<string>;
    message: string;
}

export interface Login {
    login: string;
}

export interface Password {
    password: string;
}

export interface Email {
    email: string;
}

export interface LoginInfo extends Login, Password { }

export interface ChangingPassword extends Password{
    newPassword: string;
}

export interface Week {
    date: string;
    even: boolean;
    weekNumber: number;
}

export interface Res {
    img: string;
    text: string;
    url: string;
}