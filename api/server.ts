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

const isProduction = !!+process.env.PROD
const origin = isProduction ? ["https://тгмт.рф", "https://www.тгмт.рф"] : ["http://localhost:3000"]

app.set("trust proxy", "loopback")
app.use(cors({
    origin,
    optionsSuccessStatus: 200, 
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin"
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use("/api", apiRouter)


const server = +process.env.HTTPS
    ? https.createServer({
        cert: fs.readFileSync(path.join(sslDir, "tgmt.crt")),
        key: fs.readFileSync(path.join(sslDir, "tgmt.key"))
    }, app)
    : app


server.listen(port, error => {
        if(error) {
            console.log(error)
        }

        console.log(`Server is running on port ${port}. (${ new Date().toUTCString() })`)
    
        db.on("error", err => {
            console.log(`Mongodb connection has error: ${err}`)
        });
});
