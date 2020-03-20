import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt
} from "graphql";

export default new GraphQLObjectType({
    name: "Teacher",
    fields: () => ({
        name: {
            type: GraphQLString
        },
        role: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        groups: {
            type: new GraphQLList(new GraphQLObjectType({
                name: "TeacherGroup",
                fields: () => ({
                    name: {
                        type: GraphQLString
                    },
                    id: {
                        type: GraphQLString
                    },
                    year: {
                        type: GraphQLInt
                    },
                    subjects: {
                        type: new GraphQLList(new GraphQLObjectType({
                            name: "TeacherGroupSubject",
                            fields: () => ({
                                id: {
                                    type: GraphQLString
                                }
                            })
                        }))
                    }
                })
            }))
        },
        subjects: {
            type: new GraphQLList(new GraphQLObjectType({
                name: "TeacherSubject",
                fields: () => ({
                    name: {
                        type: GraphQLString
                    },
                    id: {
                        type: GraphQLString
                    }
                })
            }))
        }
    })
})