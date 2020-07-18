import {
    GraphQLString,
    GraphQLObjectType,
} from "graphql"
import { GraphQLJSONObject } from "graphql-type-json"


export default new GraphQLObjectType({
    name: "Record",
    fields: () => ({
        name: {
            type: GraphQLString
        },
        records: {
            type: GraphQLJSONObject
        }
    })
})