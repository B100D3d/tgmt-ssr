import { buildSchema } from "graphql"

export const userDeleting = buildSchema(`

    type Query {
        need: String
    }

    type Mutation {
        deleteStudent(studentID: String!): Boolean
        deleteTeacher(teacherID: String!): Boolean
    }

`)