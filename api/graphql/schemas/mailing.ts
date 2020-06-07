import { buildSchema } from "graphql"

export const mailing = buildSchema(`

    type Query {
        mailing(type: String!, entities: [String], message: String!): Boolean
    }
`)