import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull
} from "graphql"

export default new GraphQLSchema({
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
            setEmail: {
                type: new GraphQLObjectType({
                    name: "Email",
                    fields: () => ({
                        email: {
                            type: GraphQLString
                        }
                    })
                }),
                args: {
                    email: {
                        type: GraphQLString
                    }
                }
            },
            changePassword: {
                type: GraphQLBoolean,
                args: {
                    oldPassword: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    newPassword: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                }
            }
        })
    })
})