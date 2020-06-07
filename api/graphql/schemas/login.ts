import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString, GraphQLNonNull, GraphQLInt
} from "graphql"
import User from "./types/user"

export const login = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GetUserQuery",
        fields: () => ({
            login: {
                type: User,
                args: {
                    login: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            }
        })
    })
})