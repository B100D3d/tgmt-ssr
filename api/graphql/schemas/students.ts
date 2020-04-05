import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInputObjectType
} from "graphql"

import Group from "./types/group"

const StudentEntity = new GraphQLObjectType({
    name: "StudentEntity",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        group: {
            type: Group
        },
        email: {
            type: GraphQLString
        }
    })
})

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "StudentsQuery",
        fields: () => ({
            getStudents: {
                type: new GraphQLList(StudentEntity)
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "StudentsMutation",
        fields: () => ({
            changeStudent: {
                type: StudentEntity,
                args: {
                    studentID: {
                        type: GraphQLString
                    },
                    data: {
                        type: new GraphQLInputObjectType({
                            name: "ChangedStudent",
                            fields: () => ({
                                name: {
                                    type: GraphQLString,
                                    defaultValue: undefined
                                },
                                email: {
                                    type: GraphQLString,
                                    defaultValue: undefined
                                },
                                groupID: {
                                    type: GraphQLString,
                                    defaultValue: undefined
                                }
                            })
                        })
                    }
                }
            }
        })
    })
})