import { 
    GraphQLInt,
    GraphQLObjectType
} from "graphql";

import Subject from "./subject"

export default new GraphQLObjectType({
    name: "Schedule",
    fields: () => ({
        subject: {
            type: Subject
        },
        classNumber: {
            type: GraphQLInt
        },
        weekday: {
            type: GraphQLInt
        }
    })
})