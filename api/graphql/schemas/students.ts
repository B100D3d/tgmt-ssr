import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
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

export const students = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "StudentsQuery",
        fields: () => ({
            getStudents: {
                type: new GraphQLList(StudentEntity),
                args: {
                    studentID: {
                        type: GraphQLString,
                        defaultValue: undefined
                    },
                    studentsID: {
                        type: new GraphQLList(GraphQLString),
                        defaultValue: undefined
                    },
                    groupsID: {
                        type: new GraphQLList(GraphQLString),
                        defaultValue: undefined
                    }
                }
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
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    data: {
                        type: new GraphQLInputObjectType({
                            name: "ChangedStudent",
                            fields: () => ({
                                name: {
                                    type: new GraphQLNonNull(GraphQLString)
                                },
                                email: {
                                    type: new GraphQLNonNull(GraphQLString)
                                },
                                groupID: {
                                    type: new GraphQLNonNull(GraphQLString)
                                }
                            })
                        })
                    }
                }
            }
        })
    })
})