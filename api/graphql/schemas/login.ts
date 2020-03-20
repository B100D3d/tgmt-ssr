import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} from "graphql"
import User from "./types/user"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "GetUserQuery",
        fields: () => ({
            login: {
                type: User,
                args: {
                    login: {
                        type: GraphQLString
                    },
                    password: {
                        type: GraphQLString
                    }
                }
            }
        })
    })
})