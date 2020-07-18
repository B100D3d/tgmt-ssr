import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLNonNull
} from "graphql"

import Record from "./types/record"


export const records = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "RecordsQuery",
        fields: () => ({
            getStudentRecords: {
                type: new GraphQLList(Record),
                args: {
                    month: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                }
            },
            getRecords: {
                type: new GraphQLList(Record),
                args: {
                    month: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    groupID: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    subjectID: {
                        type: new GraphQLNonNull(GraphQLString)
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
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    subjectID: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    groupID: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    entities: {
                        type: new GraphQLList(new GraphQLInputObjectType({
                            name: "InputRecords",
                            fields: () => ({
                                name: {
                                    type: new GraphQLNonNull(GraphQLString)
                                },
                                records: {
                                    type: new GraphQLList(new GraphQLList(GraphQLString))
                                }
                            })
                        }))
                    }
                }
            }
        })
    })
})