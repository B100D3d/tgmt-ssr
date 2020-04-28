import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component'

import App from "components/app/app"

import './client.sass'

const data = window.__INITIAL_DATA__
delete window.__INITIAL_DATA__

const root = document.getElementById('root')
const jsx = (
	<BrowserRouter>
		<App data={ data }/>
	</BrowserRouter>
)

loadableReady(() => hydrate(jsx, root))


if (module.hot) {
  module.hot.accept()
}
