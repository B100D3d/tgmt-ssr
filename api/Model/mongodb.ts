import mongoose from "mongoose";

const servUrl = process.env.SERV_URL;
const localUrl = process.env.LOCAL_URL;

mongoose.connect(servUrl, { autoIndex: false, 
                            useNewUrlParser: true, 
                            useUnifiedTopology: true,
                            useFindAndModify: false });

mongoose.Promise = global.Promise;

const db = mongoose.connection;

export default db;
