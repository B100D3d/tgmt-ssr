import App from './components/app/app'
import React from 'react'
import Helmet from 'react-helmet'
import { StaticRouter } from 'react-router-dom'
import { renderToString } from 'react-dom/server'

import express from 'express'
import cors from "cors"
import fs from "fs"
import path from "path"

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const app = express();

app.set("trust proxy", true)
app.use(cors({
    origin: ["https://тгмт.рф", "http://localhost:3000"], 
    optionsSuccessStatus: 200, 
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Origin"
}))

app
  .disable('x-powered-by')
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get('/*', (req, res) => {

	const staticContext = {}
	const indexFile = path.resolve(__dirname, "../index.html")


    const markup = renderToString(
      <StaticRouter context={ staticContext } location={ req.url }>
        <App />
      </StaticRouter>
	);
	
	const helmet = Helmet.renderStatic()

	const status = staticContext.statusCode || 200

	fs.readFile(indexFile, "utf8", (err, html) => {
		if(err) {
            console.log(err)
		}
		

		html = html.replace(`__HELMET__`, `${helmet.title.toString()}${helmet.meta.toString()}`)
        html = html.replace(`__CSS__`, `${
			assets.client.css
			? `<link rel="stylesheet" href="${assets.client.css}">`
			: ''
		}`)
		html = html.replace(`__ROOT__`, markup)
		html = html.replace(`__SCRIPT__`, `${
			process.env.NODE_ENV === 'production'
			? `<script src="${assets.client.js}" defer></script>`
			: `<script src="${assets.client.js}" defer crossorigin></script>`
		}`)


		res.status(status).send(html)
	})
})

export default app;
