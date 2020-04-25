import { buildSchema } from "graphql"

export default buildSchema(`

    type Query {
        need: String
    }

    type Mutation {
        deleteStudent(studentID: String): Boolean
        deleteTeacher(teacherID: String): Boolean
    }

`)