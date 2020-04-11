import axios from "axios"

const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3002"

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
    return res.data.data.getSchedule;
}

export const getSubjects = async (groupId = null) => {
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `{
            getSubjects(groupID: ${ groupId ? `"${ groupId }"` : null }) {
                id
                name
                teacher
            }
        }`
    }, { withCredentials: true })
    return res.data.data.getSubjects
}

export const sendSchedule = async (group, { even, subgroup }, schedule) => {
    const res = await axios.post(`${ url }/api/setSchedule`, {
        query: `mutation {
            setSchedule(groupID: "${ group }",
                        even: ${ even },
                        subgroup: ${ subgroup },
                        schedule: ${ schedule.map((s) => `
                            { weekday: ${ s.weekday },
                              classNumber: ${ s.classNumber },
                              subjectID: "${ s.subjectID }" },`) }) {
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

export const getRecords = async (month, groupId, subjectId) => {
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
        }`
    }, { withCredentials: true })
    return res.data.data.getRecords
}