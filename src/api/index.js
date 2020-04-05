import axios from 'axios'

export const getSchedule = async (group, { subgroup, even }) => {
    const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3002"
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

export const getSubjects = async () => {
    const url = +process.env.PROD ? "https://тгмт.рф" : "http://localhost:3002"
    const res = await axios.post(`${ url }/api/subjects`, {
        query: `{
            getSubjects{
                id
                name
                teacher
            }
        }`
    }, { withCredentials: true })
    return res.data.data.getSubjects
}