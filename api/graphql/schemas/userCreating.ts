import { buildSchema } from "graphql"

export default buildSchema(`

    type Query {
        need: String
    }

    type Mutation {
        createAdmin(name: String, email: String = "", login: String = "", password: String = ""): UserReg
        createStudent(name: String, email: String = "", groupName: String): StudentReg
        createTeacher(name: String, email: String = ""): UserReg
    }

    type UserReg {
        name: String,
        login: String,
        password: String,
        role: String,
        email: String
    }
    type StudentReg {
        name: String,
        login: String,
        password: String,
        role: String,
        email: String,
        groupName: String
    }
`)