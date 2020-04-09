import { 
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList
} from "graphql";


export default new GraphQLObjectType({
    name: "Record",
    fields: () => ({
        entity: {
            type: GraphQLString
        },
        records: {
            type: new GraphQLList(new GraphQLObjectType({
                name: "Records",
                fields: () => ({
                    day: {
                        type: GraphQLInt
                    },
                    record: {
                        type: GraphQLInt
                    }
                })
            }))
        }
    })
})