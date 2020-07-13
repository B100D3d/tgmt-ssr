import mongoose from "mongoose"

const url = process.env.MONGO_URL

mongoose.connect(url, { autoIndex: false,
                            useNewUrlParser: true, 
                            useUnifiedTopology: true,
                            useFindAndModify: false })

mongoose.Promise = global.Promise

const db = mongoose.connection

export default db
