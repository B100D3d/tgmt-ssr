import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import express from "express"
import fs from "fs"
import https from "https"
import path from "path"
import db from "./Model/mongodb"
import apiRouter from "./routes/apiRouter"

const sslDir = "/etc/ssl";

const app = express()
const port = process.env.API_PORT

app.set("trust proxy", true)
app.use(cors({
    origin: ["https://тгмт.рф", "http://localhost:3000"], 
    optionsSuccessStatus: 200, 
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin"
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/api", apiRouter)



if (+process.env.HTTPS){
    https.createServer({
        cert: fs.readFileSync(path.join(sslDir, "tgmt.crt")),
        key: fs.readFileSync(path.join(sslDir, "tgmt.key"))
    }, app).listen(port, () => {
        console.log(`Server is running on port ${port}`)
    
        db.on("error", err => {
            console.log(`Mongodb connection has error: ${err}`)
        });
    });
} else {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    
        db.on("error", err => {
            console.log(`Mongodb connection has error: ${err}`)
        });
    })
}
