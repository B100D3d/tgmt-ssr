import axios from "axios"

const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3000"

const userData = `
    ...on Admin {
        login
        name
        role
        email
        groups {
            id
            name
            year
        }
    }
    ...on Teacher {
        login
        name
        role
        email
        groups {
            id
            name
            year
            subjects {
                id
            }
        }
        subjects {
            id
            name
        }
    }
    ...on Student {
        login
        name
        role
        email
        group {
            id
            name
            year
        }
        schedule {
            subject {
                id
                name
                teacher
            }
            weekday
            classNumber
        }
    }
`

export const getSchedule = async (group, { subgroup, even }) => {
    const res = await axios.post(`${ url }/api/getSchedule`, {
        query: `{
            getSchedule(groupID: "${ group }",
                        subgroup: ${ subgroup },
                        even: ${ even }) {
                            classNumber
                            weekday
                            subject {
                                id
                                name
                                teacher
                            }
                        }
        }`
    }, { withCredentials: true }) 
    return res.data.data.getSchedule
}

export const getSubjects = async (fingerprint, groupId = null) => {
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `{
            getSubjects(groupID: ${ groupId ? `"${ groupId }"` : null }) {
                id
                name
                teacher
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.getSubjects
}

export const getSubject = async (fingerprint, subjectId) => {
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `{
            getSubjects(subjectID: "${ subjectId }") {
                id
                name
                teacher
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.getSubjects[0]
}

export const createSubject = async (fingerprint, name, teacher) => {
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `mutation {
            createSubject(
                name: "${ name }",
                teacher: "${ teacher }"
            ){
                id
                name
                teacher
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.createSubject
}

export const deleteSubject = async (fingerprint, subjectID) => {
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `mutation {
            deleteSubject(subjectID: "${ subjectID }")
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.deleteSubject
}

export const changeSubject = async (fingerprint, subjectId, name, teacher) => {
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `mutation {
            changeSubject(
                subjectID: "${ subjectId }",
                name: "${ name }",
                teacher: "${ teacher }"
            ){
                id
                name
                teacher
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.changeSubject
}

export const sendSchedule = async (fingerprint, group, { even, subgroup }, schedule) => {
    const res = await axios.post(`${ url }/api/setSchedule`, {
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
                        classNumber
                        weekday
                        subject {
                            id
                            name
                            teacher
                      }
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.setSchedule
}

export const getStudentRecords = async (month) => {
    const res = await axios.post(`${ url }/api/studentRecords`, {
        query: `{
            getStudentRecords(month: ${ month }) {
                entity
                records {
                    day
                    record
                }
            }
        }`
    }, { withCredentials: true })
    return res.data.data.getStudentRecords
}

export const getRecords = async (month, groupId, subjectId, fingerprint) => {
    const res = await axios.post(`${ url }/api/records`, {
        query: `{
        getRecords(month: ${ month },
                   groupID: "${ groupId }",
                   subjectID: "${ subjectId }") {
                        entity
                        records {
                            day
                            record
                        } 
                   }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.getRecords
}

export const sendRecords = async (fingerprint, month, groupId, subjectId, records) => {
    const res = await axios.post(`${ url }/api/records`, {
        query: `mutation {
                    setRecords(
                            month: ${ month },
                            groupID: "${ groupId }",
                            subjectID: "${ subjectId }",
                            records: [${ records.map((r) => `
                                {
                                    student: "${ r.student }",
                                    records: [${ r.records.map((re) => `
                                        {
                                            day: ${ re.day },
                                            record: "${ re.record }"
                                        }
                                    `) }]
                                }
                            `) }]
                   ) {
                        entity
                        records {
                            day
                            record
                        } 
                   }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.setRecords
}

export const getStudents = async (fingerprint, studentID = "") => {
    const res = await axios.post(`${ url }/api/students`, {
        query: `{
            getStudents(studentID: "${ studentID }") {
                id
                name
                group {
                    name
                    id
                    year
                }
                email
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.getStudents
}

export const getStudent = async (fingerprint, studentID) => {
    return (await getStudents(fingerprint, studentID))[0]
}

export const getTeachers = async (fingerprint, teacherID = "") => {
    const res = await axios.post(`${ url }/api/teachers`, {
        query: `{
            getTeachers(teacherID: "${ teacherID }") {
                id
                name
                email
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.getTeachers
}

export const getTeacher = async (fingerprint, teacherID) => {
    return (await getTeachers(fingerprint, teacherID))[0]
}

export const createStudent = async (fingerprint, name, email, group) => {
    const res = await axios.post(`${ url }/api/createUser`, {
        query: `mutation {
            createStudent(
                name: "${ name }",
                email: "${ email }",
                group: "${ group }") {
                    name
                    email
                    group
                    login
                    password
                    role
                }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.createStudent
}

export const createTeacher = async (fingerprint, name, email) => {
    const res = await axios.post(`${ url }/api/createUser`, {
        query: `mutation {
            createTeacher(
                name: "${ name }",
                email: "${ email }") {
                    name
                    email
                    login
                    password
                    role
                }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.createTeacher
}

export const deleteStudent = async (fingerprint, studentID) => {
    const res = await axios.post(`${ url }/api/deleteUser`, {
        query: `mutation { deleteStudent(studentID: "${ studentID }") }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.deleteStudent
}

export const deleteTeacher = async (fingerprint, teacherID) => {
    const res = await axios.post(`${ url }/api/deleteUser`, {
        query: `mutation { deleteTeacher(teacherID: "${ teacherID }") }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.deleteTeacher
}

export const changeStudent = async (fingerprint, studentID, name, email, groupID) => {
    const res = await axios.post(`${ url }/api/students`, {
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
    }, { withCredentials: true })
    return res.data.data.changeStudent
}

export const changeTeacher = async (fingerprint, teacherID, name, email) => {
    const res = await axios.post(`${ url }/api/teachers`, {
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
    }, { withCredentials: true })
    return res.data.data.changeTeacher
}

export const createGroup = async (fingerprint, name, year) => {
    const res = await axios.post(`${ url }/api/groups`, {
        query: `mutation{
            createGroup(
                name: "${ name }",
                year: ${ year }
            ){
                id
                name
                year
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.createGroup
}

export const deleteGroup = async (fingerprint, groupID) => {
    const res = await axios.post(`${ url }/api/groups`, {
        query: `mutation{
            deleteGroup(
                groupID: "${ groupID }"
            )
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.deleteGroup
}

export const changeGroup = async (fingerprint, name, year, groupID) => {
    const res = await axios.post(`${ url }/api/groups`, {
        query: `mutation{
            changeGroup(
                groupID: "${ groupID }",
                name: "${ name }",
                year: ${ year }
            ){
                id
                name
                year
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.changeGroup
}

export const changeUserInfo = async (fingerprint, password, email, login, newPassword) => {
    const res = await axios.post(`${ url }/api/changeUserInfo`, {
        query: `mutation{
            changeUserInfo(
                password: "${ password }",
                email: "${ email }",
                login: "${ login }",
                newPassword: "${ newPassword }"
            )
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.changeUserInfo
}

export const clearFingerprint = async (fingerprint) => {
    await axios.post(`${ url }/api/clearFingerprints`, { fingerprint }, { withCredentials: true })
}

export const mailing = async (fingerprint, type, entities, message) => {
    console.log(`{
            mailing(
                type: "${ type }",
                entities: [${ entities.map((e) => `"${ e }"`) }],
                message: "${ message }" 
            )
        }`)
    const res = await axios.post(`${ url }/api/mailing`, {
        query: `{
            mailing(
                type: "${ type }",
                entities: [${ entities.map((e) => `"${ e }"`) }],
                message: "${ message }" 
            )
        }`,
        fingerprint
    }, { withCredentials: true })
    return res.data.data.mailing
}

export const getWeek = async () => {
    const query = await axios.post(`${ url }/api/mainPage`, {
        query: `{
                 week {
                        date
                        weekNumber
                        even
                    }
                }`
    }, { withCredentials: true })
    return query.data.data.week
}

export const getResources = async () => {
    const query = await axios.post(`${ url }/api/mainPage`, {
        query: `{
            resources {
                img
                text
                url
            }
        }`
    }, { withCredentials: true })
    return query.data.data.resources
}

export const login = async (login, password, fingerprint) => {
    const query = await axios.post(`${ url }/api/login`, {
        query: `{
            login(login: "${ login }", password: "${ password }") {
                ${ userData }
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return query.data.data.login
}

export const auth = async (fingerprint) => {
    const query = await axios.post(`${ url }/api/auth`, {
        query: `{
            auth {
                ${ userData }
            }
        }`,
        fingerprint
    }, { withCredentials: true })
    return query.data.data.auth
}

export const logout = async () => {
    await axios.post(`${ url }/api/logout`, {}, { withCredentials: true })
}

