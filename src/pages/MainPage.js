import React from 'react';
import MetaTag from 'react-meta-tags';
import Slider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';

import Header from '../components/header/header';
import About from '../components/about/about';
import MobileHeader from '../components/mobile-header/mobile-header';
import Resources from '../components/resources/resources';

import bg from '../img/1.jpg';
import Footer from '../components/footer/footer';
import 'react-awesome-slider/dist/styles.css';


const AutoplaySlider = withAutoplay(Slider)

const MainPage = () => {
    return (
        <>
            <MetaTag>
                <meta name="description" content="Главная Туапсинского Гидрометеорологического Техникума" />
                <meta name="keywords" content="ТГМТ, тгмт, туапсинский гидрометеорологический техникум, главная страница тгмт" />
                <title>Главная</title>
            </MetaTag>
            <Header />
            <MobileHeader />
            <main id="wrap">
                <AutoplaySlider
                    play={true}
                    cancelOnInteraction={false}
                    interval={5000}
                    className="news">
                    <div>
                        <img src={bg} alt="bg" />
                    </div>
                    <div>
                        <img src={bg} alt="bg" />
                    </div>
                    <div>
                        <img src={bg} alt="bg" />
                    </div>
                </AutoplaySlider>
            <About />
            <Resources />
            <Footer />
            </main>
        </>
    );
}

export default MainPage;