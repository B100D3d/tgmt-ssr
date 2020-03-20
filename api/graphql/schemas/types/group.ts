import { 
    GraphQLInt,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";

export default new GraphQLObjectType({
    name: "Group",
    fields: () => ({
        name: {
            type: GraphQLString
        },
        id: {
            type: GraphQLString
        },
        year: {
            type: GraphQLInt
        }
    })
})
