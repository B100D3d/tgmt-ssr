import { buildSchema } from "graphql"

export const mainPageInfo =  buildSchema(`

type Query {
    week: Week,
    resources: [Resource]
}

type Week {
    date: String,
    weekNumber: Int,
    even: Boolean
}

type Resource {
    img: String,
    text: String,
    url: String
}
`)