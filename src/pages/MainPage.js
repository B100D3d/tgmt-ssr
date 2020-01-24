import React from 'react';

import Header from '../components/header/header';
import About from '../components/about/about';
import MobileHeader from '../components/mobile-header/mobile-header';
import OpenButton from '../components/open-button/open-button';
import Resources from '../components/resources/resources';

import bg from '../img/1.jpg';


const MainPage = () => {
    return (
        <>
            <Header />
            <MobileHeader />
            <div className="news">
                <img src={bg} />
            </div>
            <About />
            <Resources />
        </>
    );
}

export default MainPage;