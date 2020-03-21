import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom';
import StyleContext from 'isomorphic-style-loader/StyleContext'

import App from "./components/app/app"

import './index.sass';

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => removeCss.forEach(dispose => dispose())
}


ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </StyleContext.Provider>, 
document.getElementById('root'));