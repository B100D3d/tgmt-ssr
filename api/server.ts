import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

import express from "express"
import apiRouter from "./routes/apiRouter"


const app = express()

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

export default app
