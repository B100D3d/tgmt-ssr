import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList, GraphQLInputObjectType, GraphQLNonNull, GraphQLInt
} from "graphql"

const TeacherEntity = new GraphQLObjectType({
    name: "TeacherEntity",
    fields: () => ({
        id: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        }
    })
})

export const teachers = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "TeachersQuery",
        fields: () => ({
            getTeachers: {
                type: new GraphQLList(TeacherEntity),
                args: {
                    teacherID: {
                        type: GraphQLString,
                        defaultValue: undefined
                    }
                }
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "TeachersMutation",
        fields: () => ({
            changeTeacher: {
                type: TeacherEntity,
                args: {
                    teacherID: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    data: {
                        type: new GraphQLInputObjectType({
                            name: "ChangedTeacher",
                            fields: () => ({
                                name: {
                                    type: new GraphQLNonNull(GraphQLString)
                                },
                                email: {
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