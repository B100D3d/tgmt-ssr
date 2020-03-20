import { 
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLList
} from "graphql";
import { GraphQLDate } from "graphql-iso-date";


export default new GraphQLObjectType({
    name: "Absence",
    fields: () => ({
        date: {
            type: GraphQLDate
        },
        absences: {
            type: new GraphQLList(GraphQLBoolean)
        }
    })
})