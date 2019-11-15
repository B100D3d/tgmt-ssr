import React from 'react';
import ReactDOM from 'react-dom';

import './index.sass';
import bg from './img/1.jpg';

import Header from './components/header/header';
import About from './components/about/about';
import MobileHeader from './components/mobile-header/mobile-header';
import OpenButton from './components/open-button/open-button';




const App = () => {
    return (
        <div>
            <Header />
            <MobileHeader />
            <div className="news">
                <img src={bg} />
            </div>
            <About />
            <OpenButton />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));