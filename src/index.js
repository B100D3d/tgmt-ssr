import React from 'react';
import ReactDOM from 'react-dom';

import './index.sass';

import Header from './components/header/header';
import About from './components/about/about';
import MobileHeader from './components/mobile-header/mobile-header';
import OpenButton from './components/open-button/open-button';




const App = () => {
    return (
        <div>
            <Header />
            <MobileHeader />
            <div className="news" />
            <About />
            <OpenButton />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));