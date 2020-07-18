import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull
} from "graphql"

import Subject from "./types/subject"

export const subjects = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GroupQuery",
        fields: () => ({
            getSubjects: {
                type: new GraphQLList(Subject),
                args: {
                    groupID: {
                        type: GraphQLString,
                        defaultValue: null
                    },
                    subjectID: {
                        type: GraphQLString,
                        defaultValue: null
                    }
                }
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
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    teacher: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            },
            deleteSubject: {
                type: GraphQLBoolean,
                args: {
                    subjectID: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            },
            changeSubject: {
                type: Subject,
                args: {
                    subjectID: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    teacher: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            }
        })
    })
})