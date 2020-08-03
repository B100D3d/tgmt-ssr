import mongoose from "mongoose"
import { Request } from "express"

const url = process.env.MONGO_URL

mongoose.connect(url, { autoIndex: false,
                            useNewUrlParser: true, 
                            useUnifiedTopology: true,
                            useFindAndModify: false })

mongoose.Promise = global.Promise

const db = mongoose.connection

export default db

export const startSession = async (req: Request) => {
    const session = await mongoose.startSession()

    if(req.testAccount) {
        session.commitTransaction = () => null
    }

    return session
}
