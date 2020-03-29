import App from './components/app/app'
import React from 'react'
import Helmet from 'react-helmet'
import { StaticRouter } from 'react-router-dom'
import { matchPath } from "react-router"
import { renderToString } from 'react-dom/server'
import { ChunkExtractor, ChunkExtractorManager } from '@loadable/server'
import { html as htmlTemplate, oneLineTrim } from 'common-tags'

import routes from "../dist/routes"

import express from 'express'
import cors from "cors"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import path from "path"

const app = express();

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
!+process.env.PROD && app.use(express.static(process.env.RAZZLE_PUBLIC_DIR))

app
  .disable('x-powered-by')
  .get('/*', async (req, res) => {
	
	console.log(process.env.RAZZLE_PUBLIC_DIR)
	console.log(req.url, req.body)

	const ua = req.headers["user-agent"]

	const staticContext = {}

	const extractor = new ChunkExtractor({
		statsFile: path.resolve('build/loadable-stats.json'),
		entrypoints: ['client'],
	})

	let promise
	routes.some(route => {
		const match = matchPath(req.url, route)
		if(match && route.loadData) promise = route.loadData()
		return match
	})
	const data = await promise || {}

    const markup = renderToString(
		<ChunkExtractorManager extractor={ extractor }> 
			<StaticRouter context={ staticContext } location={ req.url }>
				<App data={ data }/>
			</StaticRouter>
	  	</ChunkExtractorManager>
	);
	
	const helmet = Helmet.renderStatic()

	const status = staticContext.statusCode || 200

	const html = await getHtml(markup, extractor, helmet, data, ua)

	res.status(status).send(html)
})

export default app;

const getHtml = async (markup, extractor, helmet, initialData, ua) => {
	const isCrawler = crawlerUserAgents.some(crawler => ua.toLowerCase().indexOf(crawler.toLowerCase()) !== -1)
	const styles = await extractor.getInlineStyleTags()
	return oneLineTrim(htmlTemplate`
	<!DOCTYPE html>
	<html lang="ru">
	  <head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		${helmet.title.toString()}
		${helmet.meta.toString()}
		${styles}
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
		<link href="https://fonts.googleapis.com/css?family=Noto+Sans:400,700&display=swap&subset=cyrillic" rel="stylesheet">
	</head>
	  <body>
		<div id="root">${markup}</div>
		${!isCrawler && `<script type="text/javascript">window.__INITIAL_DATA__=${JSON.stringify(initialData)}</script>`}
		${!isCrawler && extractor.getScriptTags()}
		 ${!isCrawler && `<!-- Yandex.Metrika counter -->
		 <script type="text/javascript">
		  (function (m, e, t, r, i, k, a) {
		  m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
			m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0],
			k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
		  })
			(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
	
		  ym(56458561, "init", {
			clickmap: true,
			trackLinks: true,
			accurateTrackBounce: true
		  });
		</script>
		<noscript>
		  <div><img src="https://mc.yandex.ru/watch/56458561" style="position:absolute; left:-9999px;"
			alt="" /></div>
		</noscript>
		<!-- /Yandex.Metrika counter -->
	
		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-158657926-1"></script>
		<script>
		  window.dataLayer = window.dataLayer || [];
		  function gtag() { dataLayer.push(arguments); }
		  gtag('js', new Date());
	
		  gtag('config', 'UA-158657926-1');
		</script>`}
		<noscript>You need to enable JavaScript to run this app.</noscript>
	  </body>
	</html>	
	`)
}


const crawlerUserAgents = [
	'googlebot',
	'Yahoo! Slurp',
	'bingbot',
	'yandex',
	'baiduspider',
	'facebookexternalhit',
	'twitterbot',
	"TelegramBot",
	'rogerbot',
	'linkedinbot',
	'embedly',
	'quora link preview',
	'showyoubot',
	'outbrain',
	'pinterest/0.',
	'developers.google.com/+/web/snippet',
	'slackbot',
	'vkShare',
	'W3C_Validator',
	'redditbot',
	'Applebot',
	'WhatsApp',
	'flipboard',
	'tumblr',
	'bitlybot',
	'SkypeUriPreview',
	'nuzzel',
	'Discordbot',
	'Google Page Speed',
	'Qwantify',
	'pinterestbot',
	'Bitrix link preview',
	'XING-contenttabreceiver',
	'Chrome-Lighthouse'
  ];
