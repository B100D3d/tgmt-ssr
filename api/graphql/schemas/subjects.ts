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
                    subjectID: {
                        type: GraphQLString
                    }
                }
            },
            changeSubject: {
                type: Subject,
                args: {
                    subjectID: {
                        type: GraphQLString
                    },
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