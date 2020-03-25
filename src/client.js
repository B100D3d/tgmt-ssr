import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { hydrate } from 'react-dom'
import { loadableReady } from '@loadable/component'

import App from "./components/app/app"

import './client.sass'

const root = document.getElementById('root')
const jsx = (
	<BrowserRouter>
		<App />
	</BrowserRouter>
)

loadableReady(() => hydrate(jsx, root))


if (module.hot) {
  module.hot.accept()
}
