import {
    Email,
    ExpressParams,
    Mailing
} from "../types"
import { getStudents } from "./Student"
import { getTeachers } from "./Teacher"
import { getUsers } from "./User"
import { sendMailing } from "./Email"


export const mailing = async (args: Mailing, { req, res }: ExpressParams) => {
    const { type, entities: ids, message } = args

    const entities = type === "Students"
        ? await getStudents({ studentsID: ids }, { req, res })
        : type === "Teachers"
        ? await getTeachers({ teachersID: ids }, { req, res })
        : type === "Groups"
        ? await getStudents({ groupsID: ids }, { req, res })
        : await getUsers({ req, res })

    if(!entities) {
        console.log("Entities not found")
        res.status(404)
        return
    }

    const emails = (entities as Array<Email>).map(e => e.email)

    try {
        sendMailing(message, emails)
        return true
    } catch (e) {
        console.log("Email not sent", e)
        res.status(500)
        return false
    }
}