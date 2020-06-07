import {
    GraphQLSchema,
    GraphQLObjectType
} from "graphql"
import User from "./types/user"

export const auth = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GetUserQuery",
        fields: () => ({
            auth: {
                type: User
            }
        })
    })
})