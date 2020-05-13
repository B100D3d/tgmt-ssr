import { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} from "graphql";

import Group from "./group"

import Schedule from "./schedule";

export default new GraphQLObjectType({
    name: "Student",
    fields: () => ({
        login: {
            type: GraphQLString
        },
        name: {
            type: GraphQLString
        },
        role: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        group: {
            type: Group
        },
        schedule: {
            type: new GraphQLList(Schedule)
        }
    })
})