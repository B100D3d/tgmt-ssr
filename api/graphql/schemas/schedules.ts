import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLInputObjectType,
    GraphQLBoolean, GraphQLNonNull
} from "graphql"

import Schedule from "./types/schedule"

export const schedules = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "SchedulesQuery",
        fields: () => ({
            getSchedule: {
                type: new GraphQLList(Schedule),
                args: {
                    groupID: {
                        type: new GraphQLNonNull(GraphQLString)
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
                        type: new GraphQLNonNull(GraphQLString)
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
                                    type: new GraphQLNonNull(GraphQLInt)
                                },
                                classNumber: {
                                    type: new GraphQLNonNull(GraphQLInt)
                                }
                            })
                        }))
                    }
                }
            }
        })
    })
})