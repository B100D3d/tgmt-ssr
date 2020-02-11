import React from 'react';

import Header from '../components/header/header';
import About from '../components/about/about';
import MobileHeader from '../components/mobile-header/mobile-header';
import Resources from '../components/resources/resources';

import bg from '../img/1.jpg';


const MainPage = () => {
    return (
        <>
                <Header />
                <MobileHeader />
                <main id="wrap">
                    <div className="news">
                        <img src={bg} alt="bg" />
                    </div>
                <About />
                <Resources />
            </main>
        </>
    );
}

export default MainPage;