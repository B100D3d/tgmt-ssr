import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull
} from "graphql"

import Group from "./types/group"

export const groups = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GroupQuery",
        fields: () => ({
            getGroups: {
                type: new GraphQLList(Group)
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "GroupMutation",
        fields: () => ({
            createGroup: {
                type: Group,
                args: {
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    year: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                }
            },
            deleteGroup: {
                type: GraphQLBoolean,
                args: {
                    groupID: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            },
            changeGroup: {
                type: Group,
                args: {
                    groupID: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    year: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                }
            }
        })
    })
})