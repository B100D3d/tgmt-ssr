import getWeek from "../Model/Date";
import { getResources } from "../Model/Resources";
import {
    auth,
    login,
    setEmail,
    changePassword,
} from "../Model/User";
import { createAdmin } from "../Model/Admin"
import { createTeacher, getTeachers } from "../Model/Teacher"
import { createStudent, getStudents } from "../Model/Student"
import { getGroups, createGroup, deleteGroup } from "../Model/Group"
import { getSubjects, createSubject, deleteSubject } from "../Model/Subject"
import { getSchedule, setSchedule } from "../Model/Schedule"
import { getStudentGrades, getGrades, setGrades } from "../Model/Grade"

export default class Resolver {
    public static mainPageResolver = {
        week: getWeek,
        resources: getResources,
    };

    public static createUsersResolver = {
        createAdmin,
        createStudent,
        createTeacher
    };

    public static loginResolver = {
        login
    }

    public static authResolver = {
        auth
    }

    public static setUserInfoResolver = {
        setEmail,
        changePassword
    }

    public static groupsResolver = {
        createGroup,
        deleteGroup,
        getGroups
    }

    public static studentsResolver = {
        getStudents
    }

    public static teachersResolver = {
        getTeachers
    }

    public static subjectsResolver = {
        createSubject,
        deleteSubject,
        getSubjects
    }

    public static setScheduleResolver = {
        setSchedule
    }

    public static getScheduleResolver = {
        getSchedule
    }

    public static studentGradesResolver = {
        getStudentGrades
    }

    public static gradesResolver = {
        getGrades,
        setGrades
    }
}