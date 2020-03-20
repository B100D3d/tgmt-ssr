import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} from "graphql"

import Subject from "./types/subject"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GroupQuery",
        fields: () => ({
            getSubjects: {
                type: new GraphQLList(Subject)
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "GroupMutation",
        fields: () => ({
            createSubject: {
                type: Subject,
                args: {
                    name: {
                        type: GraphQLString
                    },
                    teacher: {
                        type: GraphQLString
                    }
                }
            },
            deleteSubject: {
                type: GraphQLBoolean,
                args: {
                    name: {
                        type: GraphQLString
                    },
                    teacher: {
                        type: GraphQLString
                    }
                }
            }
        })
    })
})