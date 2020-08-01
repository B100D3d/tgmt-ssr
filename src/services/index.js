import axios from "axios"
import * as Fields from "./fields"

const baseURL = process.env.PROD === "true"
    ? "https://тгмт.рф/api"
    : "http://localhost:3000/api"

const apiClient = axios.create({ baseURL })

export const getSchedule = async (group, { subgroup, even }) => {
    const res = await apiClient.post("/getSchedule", {
        query: `{
            getSchedule(groupID: "${ group }",
                        subgroup: ${ subgroup },
                        even: ${ even }) {
                            ${ Fields.scheduleFields }
                        }
        }`
    }) 
    return res.data.data.getSchedule
}

export const getSubjects = async (fingerprint, groupId = null) => {
    const res = await apiClient.post("/subjects", {
        query: `{
            getSubjects(groupID: ${ groupId ? `"${ groupId }"` : null }) {
                ${ Fields.subjectFields } 
            }
        }`,
        fingerprint
    })
    return res.data.data.getSubjects
}

export const getSubject = async (fingerprint, subjectId) => {
    const res = await apiClient.post("/subjects", {
        query: `{
            getSubjects(subjectID: "${ subjectId }") {
                ${ Fields.subjectFields } 
            }
        }`,
        fingerprint
    })
    return res.data.data.getSubjects[0]
}

export const createSubject = async (fingerprint, name, teacher) => {
    const res = await apiClient.post("/subjects", {
        query: `mutation {
            createSubject(
                name: "${ name }",
                teacher: "${ teacher }"
            ){
                ${ Fields.subjectFields } 
            }
        }`,
        fingerprint
    })
    return res.data.data.createSubject
}

export const deleteSubject = async (fingerprint, subjectID) => {
    const res = await apiClient.post("/subjects", {
        query: `mutation {
            deleteSubject(subjectID: "${ subjectID }")
        }`,
        fingerprint
    })
    return res.data.data.deleteSubject
}

export const changeSubject = async (fingerprint, subjectId, name, teacher) => {
    const res = await apiClient.post("/subjects", {
        query: `mutation {
            changeSubject(
                subjectID: "${ subjectId }",
                name: "${ name }",
                teacher: "${ teacher }"
            ){
                ${ Fields.subjectFields } 
            }
        }`,
        fingerprint
    })
    return res.data.data.changeSubject
}

export const sendSchedule = async (fingerprint, group, { even, subgroup }, schedule) => {
    const res = await apiClient.post("/setSchedule", {
        query: `mutation {
                    setSchedule(
                        groupID: "${ group }",
                        even: ${ even },
                        subgroup: ${ subgroup },
                        schedule: [${ schedule.map((s) => `
                            { 
                                weekday: ${ s.weekday },
                                classNumber: ${ s.classNumber },
                                subjectID: "${ s.subjectID }" 
                            }
                        `) }]
                    ) {
                        ${ Fields.scheduleFields }
                }
        }`,
        fingerprint
    })
    return res.data.data.setSchedule
}

export const getStudentRecords = async (month) => {
    const res = await apiClient.post("/studentRecords", {
        query: `{
            getStudentRecords(month: ${ month }) {
                ${ Fields.recordsFields }
            }
        }`
    })
    return res.data.data.getStudentRecords
}

export const getRecords = async (month, groupId, subjectId, fingerprint) => {
    const res = await apiClient.post("/records", {
        query: `{
        getRecords(month: ${ month },
                   groupID: "${ groupId }",
                   subjectID: "${ subjectId }") {
                        ${ Fields.recordsFields }
                   }
        }`,
        fingerprint
    })
    return res.data.data.getRecords
}

export const sendRecords = async (fingerprint, month, groupId, subjectId, cells) => {
    const res = await apiClient.post("/records", {
        query: `mutation {
                    setRecords(
                            month: ${ month },
                            groupID: "${ groupId }",
                            subjectID: "${ subjectId }",
                            entities: [${ cells.map((cell) => `
                                {
                                    name: "${ cell.name }",
                                    records: [${
                                        Object
                                            .entries(cells[0].records)
                                            .map(([day, record]) => `["${day}", "${record}"]`)
                                    }]
                                }
                            `) }]
                   ) {
                        ${ Fields.recordsFields }
                   }
    }`,
        fingerprint
    })
    return res.data.data.setRecords
}

export const getStudents = async (fingerprint, studentID = "") => {
    const res = await apiClient.post("/students", {
        query: `{
            getStudents(studentID: "${ studentID }") {
                ${ Fields.studentsFields }
            }
        }`,
        fingerprint
    })
    return res.data.data.getStudents
}

export const getStudent = async (fingerprint, studentID) => {
    return (await getStudents(fingerprint, studentID))[0]
}

export const getTeachers = async (fingerprint, teacherID = "") => {
    const res = await apiClient.post("/teachers", {
        query: `{
            getTeachers(teacherID: "${ teacherID }") {
                ${ Fields.teachersFields }
            }
        }`,
        fingerprint
    })
    return res.data.data.getTeachers
}

export const getTeacher = async (fingerprint, teacherID) => {
    return (await getTeachers(fingerprint, teacherID))[0]
}

export const createStudent = async (fingerprint, name, email, group) => {
    const res = await apiClient.post("/createUser", {
        query: `mutation {
            createStudent(
                name: "${ name }",
                email: "${ email }",
                group: "${ group }") {
                    ${ Fields.studentFields }
                }
        }`,
        fingerprint
    })
    return res.data.data.createStudent
}

export const createTeacher = async (fingerprint, name, email) => {
    const res = await apiClient.post("/createUser", {
        query: `mutation {
            createTeacher(
                name: "${ name }",
                email: "${ email }") {
                    ${ Fields.techerFields }
                }
        }`,
        fingerprint
    })
    return res.data.data.createTeacher
}

export const deleteStudent = async (fingerprint, studentID) => {
    const res = await apiClient.post("/deleteUser", {
        query: `mutation { deleteStudent(studentID: "${ studentID }") }`,
        fingerprint
    })
    return res.data.data.deleteStudent
}

export const deleteTeacher = async (fingerprint, teacherID) => {
    const res = await apiClient.post("/deleteUser", {
        query: `mutation { deleteTeacher(teacherID: "${ teacherID }") }`,
        fingerprint
    })
    return res.data.data.deleteTeacher
}

export const changeStudent = async (fingerprint, studentID, name, email, groupID) => {
    const res = await apiClient.post("/students", {
        query: `mutation{
            changeStudent(
                studentID: "${ studentID }",
                data: {
                    name: "${ name }",
                    email: "${ email }",
                    groupID: "${ groupID }"
                }
            ) {
                id
            }
        }`,
        fingerprint
    })
    return res.data.data.changeStudent
}

export const changeTeacher = async (fingerprint, teacherID, name, email) => {
    const res = await apiClient.post("/teachers", {
        query: `mutation{
            changeTeacher(
                teacherID: "${ teacherID }",
                data: {
                    name: "${ name }",
                    email: "${ email }"
                }
            ) {
                id
            }
        }`,
        fingerprint
    })
    return res.data.data.changeTeacher
}

export const createGroup = async (fingerprint, name, year) => {
    const res = await apiClient.post("/groups", {
        query: `mutation{
            createGroup(
                name: "${ name }",
                year: ${ year }
            ){
                ${ Fields.groupFields }
            }
        }`,
        fingerprint
    })
    return res.data.data.createGroup
}

export const deleteGroup = async (fingerprint, groupID) => {
    const res = await apiClient.post("/groups", {
        query: `mutation{
            deleteGroup(
                groupID: "${ groupID }"
            )
        }`,
        fingerprint
    })
    return res.data.data.deleteGroup
}

export const changeGroup = async (fingerprint, name, year, groupID) => {
    const res = await apiClient.post("/groups", {
        query: `mutation{
            changeGroup(
                groupID: "${ groupID }",
                name: "${ name }",
                year: ${ year }
            ){
                ${ Fields.groupFields }
            }
        }`,
        fingerprint
    })
    return res.data.data.changeGroup
}

export const changeUserInfo = async (fingerprint, password, email, login, newPassword) => {
    const res = await apiClient.post("/changeUserInfo", {
        query: `mutation{
            changeUserInfo(
                password: "${ password }",
                email: "${ email }",
                login: "${ login }",
                newPassword: "${ newPassword }"
            )
        }`,
        fingerprint
    })
    return res.data.data.changeUserInfo
}

export const clearFingerprint = async (fingerprint) =>
    await apiClient.post("/clearFingerprints", { fingerprint })

export const mailing = async (fingerprint, type, entities, message) => {
    const res = await apiClient.post("/mailing", {
        query: `{
            mailing(
                type: "${ type }",
                entities: [${ entities.map((e) => `"${ e }"`) }],
                message: "${ message }" 
            )
        }`,
        fingerprint
    })
    return res.data.data.mailing
}

export const getWeek = async () => {
    const query = await apiClient.post("/mainPage", {
        query: `{
                 week {
                    ${ Fields.weekFields }       
                 }
                }`
    })
    return query.data.data.week
}

export const getResources = async () => {
    const query = await apiClient.post("/mainPage", {
        query: `{
            resources {
                ${ Fields.resourcesFields }
            }
        }`
    })
    return query.data.data.resources
}

export const login = async (login, password, fingerprint) => {
    const query = await apiClient.post("/login", {
        query: `{
            login(login: "${ login }", password: "${ password }") {
                ${ Fields.userFields }
            }
        }`,
        fingerprint
    })
    return query.data.data.login
}

export const auth = async (fingerprint) => {
    const query = await apiClient.post("/auth", {
        query: `{
            auth {
                ${ Fields.userFields }
            }
        }`,
        fingerprint
    })
    return query.data.data.auth
}

export const logout = async () => await apiClient.post("/logout", {})


