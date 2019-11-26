import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './index.sass';
import bg from './img/1.jpg';

import Header from './components/header/header';
import About from './components/about/about';
import MobileHeader from './components/mobile-header/mobile-header';
import OpenButton from './components/open-button/open-button';
import Auth from './components/auth/auth.js';




const MainPage = () => {
    return (
        <>
            <Header />
            <MobileHeader />
            <div className="news">
                <img src={bg} />
            </div>
            <About />
            <OpenButton />
        </>
    );
}


const AuthPage = () => {
    return (
        <>
            <Auth />
        </>
    )
}

const Test = () => (
    <>
        <Header />
        <MobileHeader />
        <About />
        <OpenButton />
    </>
)



const App = () => (
        <>
            <Router>
                <Route exact path='/' component={MainPage} />
                <Route path='/user' component={AuthPage} />
                <Route path='/documents' component={Test} />
            </Router>
        </>
)





ReactDOM.render(<App />, document.getElementById('root'));