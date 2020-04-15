import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType
} from "graphql"

import Record from "./types/record"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RecordsQuery",
        fields: () => ({
            getStudentRecords: {
                type: new GraphQLList(Record),
                args: {
                    month: {
                        type: GraphQLInt
                    }
                }
            },
            getRecords: {
                type: new GraphQLList(Record),
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
        name: "RecordsMutation",
        fields: () => ({
            setRecords: {
                type: new GraphQLList(Record),
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
                    records: {
                        type: new GraphQLList(new GraphQLInputObjectType({
                            name: "InputRecords",
                            fields: () => ({
                                student: {
                                    type: GraphQLString
                                },
                                records: {
                                    type: new GraphQLList(new GraphQLInputObjectType({
                                        name: "InputStudentRecords",
                                        fields: () => ({
                                            day: {
                                                type: GraphQLInt
                                            },
                                            record: {
                                                type: GraphQLString
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