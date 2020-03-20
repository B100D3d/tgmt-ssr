import { 
    GraphQLInt,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList
} from "graphql";


export default new GraphQLObjectType({
    name: "Grade",
    fields: () => ({
        entity: {
            type: GraphQLString
        },
        grades: {
            type: new GraphQLList(new GraphQLObjectType({
                name: "Grades",
                fields: () => ({
                    day: {
                        type: GraphQLInt
                    },
                    grade: {
                        type: GraphQLInt
                    }
                })
            }))
        }
    })
})