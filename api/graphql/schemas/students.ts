import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from "graphql"

import Group from "./types/group"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "StudentsQuery",
        fields: () => ({
            getStudents: {
                type: new GraphQLList(new GraphQLObjectType({
                    name: "StudentEntity",
                    fields: () => ({
                        id: {
                            type: GraphQLString
                        },
                        name: {
                            type: GraphQLString
                        },
                        group: {
                            type: Group
                        },
                        email: {
                            type: GraphQLString
                        }
                    })
                }))
            }
        })
    })
})