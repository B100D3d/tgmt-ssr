import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLBoolean
} from "graphql"

import Grade from "./types/grade"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GradesQuery",
        fields: () => ({
            getStudentGrades: {
                type: new GraphQLList(Grade),
                args: {
                    month: {
                        type: GraphQLInt
                    }
                }
            },
            getGrades: {
                type: new GraphQLList(Grade),
                args: {
                    month: {
                        type: GraphQLInt
                    },
                    groupID: {
                        type: GraphQLString
                    },
                    subjectID: {
                        type: GraphQLString
                    }
                }
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "GradesMutation",
        fields: () => ({
            setGrades: {
                type: new GraphQLList(Grade),
                args: {
                    month: {
                        type: GraphQLInt
                    },
                    subjectID: {
                        type: GraphQLString
                    },
                    groupID: {
                        type: GraphQLString
                    },
                    grades: {
                        type: new GraphQLList(new GraphQLInputObjectType({
                            name: "InputGrades",
                            fields: () => ({
                                student: {
                                    type: GraphQLString
                                },
                                grades: {
                                    type: new GraphQLList(new GraphQLInputObjectType({
                                        name: "InputStudentGrades",
                                        fields: () => ({
                                            day: {
                                                type: GraphQLInt
                                            },
                                            grade: {
                                                type: GraphQLInt
                                            }
                                        })
                                    }))
                                }
                            })
                        }))
                    }
                }
            }
        })
    })
})