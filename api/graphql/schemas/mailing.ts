import { buildSchema } from "graphql"

export default buildSchema(`

    type Query {
        mailing(type: String, entities: [String], message: String): Boolean
    }
`)