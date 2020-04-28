import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList, GraphQLInputObjectType
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

export default new GraphQLSchema({
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
                        type: GraphQLString
                    },
                    data: {
                        type: new GraphQLInputObjectType({
                            name: "ChangedTeacher",
                            fields: () => ({
                                name: {
                                    type: GraphQLString
                                },
                                email: {
                                    type: GraphQLString
                                }
                            })
                        })
                    }
                }
            }
        })
    })
})