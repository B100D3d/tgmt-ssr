import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} from "graphql"

import Group from "./types/group"

export default new GraphQLSchema({
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
                        type: GraphQLString
                    },
                    year: {
                        type: GraphQLInt
                    }
                }
            },
            deleteGroup: {
                type: GraphQLBoolean,
                args: {
                    groupID: {
                        type: GraphQLString
                    }
                }
            },
            changeGroup: {
                type: Group,
                args: {
                    groupID: {
                        type: GraphQLString
                    },
                    name: {
                        type: GraphQLString
                    },
                    year: {
                        type: GraphQLInt
                    }
                }
            }
        })
    })
})