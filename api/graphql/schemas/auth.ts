import {
    GraphQLSchema,
    GraphQLObjectType
} from "graphql"
import User from "./types/user"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GetUserQuery",
        fields: () => ({
            auth: {
                type: User
            }
        })
    })
})