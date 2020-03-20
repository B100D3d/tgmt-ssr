import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} from "graphql"

export default new GraphQLSchema({
    query: new GraphQLObjectType({
        name: "TeachersQuery",
        fields: () => ({
            getTeachers: {
                type: new GraphQLList(new GraphQLObjectType({
                    name: "TeacherEntity",
                    fields: () => ({
                        id: {
                            type: GraphQLString
                        },
                        name: {
                            type: GraphQLString
                        },
                        email: {
                            type: GraphQLString
                        }
                    })
                }))
            }
        })
    })
})