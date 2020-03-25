import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'

import App from "./components/app/app"

import './client.sass'

ReactDOM.hydrate(
        <BrowserRouter>
            <App />
        </BrowserRouter>,
document.getElementById('root'))

if (module.hot) {
  module.hot.accept()
}
