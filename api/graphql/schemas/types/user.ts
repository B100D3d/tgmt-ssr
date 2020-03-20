import {
    GraphQLUnionType,
    GraphQLObjectType
} from "graphql";
import Admin from "./admin"
import Teacher from "./teacher"
import Student from "./student"

export default new GraphQLUnionType({
    name: "User",
    types: [Admin, Teacher, Student],
    resolveType(value): GraphQLObjectType {
        if (value.subjects) {
            return Teacher
        }
        else if (value.groups) {
            return Admin
        }
        else {
            return Student
        }
    }
})