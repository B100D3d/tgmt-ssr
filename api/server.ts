import cors from "cors"
import express from "express"
import apiRouter from "./routes/apiRouter"

const app = express()

const isProduction = !!+process.env.PROD
const origin = isProduction ? [
    "https://тгмт.рф",
    "https://www.тгмт.рф",
    "https://tgmt.herokuapp.com",
    "https://www.tgmt.herokuapp.com"]
    : ["http://localhost:3000"]

app
    .use(cors({
        origin,
        optionsSuccessStatus: 200,
        credentials: true,
        methods: ["GET", "POST"],
        allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin"
    }))
    .use("/api", apiRouter)

export default app
