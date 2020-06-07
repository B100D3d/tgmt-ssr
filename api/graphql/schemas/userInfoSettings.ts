import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull
} from "graphql"

export const userInfoSettings =  new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "SetUserInfoQuery",
        fields: () => ({
            need: {
                type: GraphQLString
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: "SetUserInfoMutation",
        fields: () => ({
            changeUserInfo: {
                type: GraphQLBoolean,
                args: {
                    password: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    email: {
                        type: GraphQLString
                    },
                    login: {
                        type: GraphQLString
                    },
                    newPassword: {
                        type: GraphQLString
                    }
                }
            }
        })
    })
})