import {
    GraphQLObjectType,
    GraphQLString,
} from "graphql";


export default new GraphQLObjectType({
    name: "Subject",
    fields: () => ({
        name: {
            type: GraphQLString
        },
        teacher: {
            type: GraphQLString
        },
        id: {
            type: GraphQLString
        }
    })
})