import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLBoolean
} from "graphql"

import Schedule from "./types/schedule"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "SchedulesQuery",
        fields: () => ({
            getSchedule: {
                type: new GraphQLList(Schedule),
                args: {
                    groupID: {
                        type: GraphQLString
                    },
                    even: {
                        type: GraphQLBoolean,
                        defaultValue: null
                    },
                    subgroup: {
                        type: GraphQLInt,
                        defaultValue: null
                    }
                }
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "SchedulesMutation",
        fields: () => ({
            setSchedule: {
                type: new GraphQLList(Schedule),
                args: {
                    groupID: {
                        type: GraphQLString
                    },
                    even: {
                        type: GraphQLBoolean,
                        defaultValue: null

                    },
                    subgroup: {
                        type: GraphQLInt,
                        defaultValue: null
                    },
                    schedule: {
                        type: new GraphQLList(new GraphQLInputObjectType({
                            name: "Schedules",
                            fields: () => ({
                                subjectID: {
                                    type: GraphQLString
                                },
                                weekday: {
                                    type: GraphQLInt
                                },
                                classNumber: {
                                    type: GraphQLInt 
                                }
                            })
                        }))
                    }
                }
            }
        })
    })
})