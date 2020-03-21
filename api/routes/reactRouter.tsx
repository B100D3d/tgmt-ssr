import { Router, Request, Response } from "express"

import React from "react"
import ReactDOMServer from "react-dom/server"
import { StaticRouter } from "react-router-dom"
import { StaticRouterContext } from "react-router"
import Helmet from 'react-helmet';

import path from "path"
import fs from "fs"

import App from "../../src/components/app/app"

const reactRouter = Router()


reactRouter.get("*", (req: Request, res: Response) => {

    const staticContext: StaticRouterContext = { }
   
    
    const markup = ReactDOMServer.renderToString(
        <StaticRouter location={ req.url } context={ staticContext }>
                <App />
        </StaticRouter>
    )

    const helmet = Helmet.renderStatic()

    const indexFile = path.resolve("build/index.html")

    fs.readFile(indexFile, "utf8", (err, html) => {
        if(err) {
            console.log(err)
        }

        html = html.replace(`<div id="root"></div>`, `<div id="root">${markup}</div>`)
        html = html.replace(`<title>ТГМТ</title>`, `${helmet.title.toString()}${helmet.meta.toString()}`)

        const status = staticContext.statusCode || 200

        res.status(status).send(html)
    })
})


export default reactRouter