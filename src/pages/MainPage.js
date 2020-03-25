import React from 'react';

import Helmet from 'react-helmet';
import Slider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';

import Header from '../components/header/header';
import MobileHeader from '../components/mobile-header/mobile-header';
import Resources from '../components/resources/resources';

import bg from '/static/1.jpg';
import Footer from '../components/footer/footer';
import s from 'react-awesome-slider/src/core/styles.scss';

import About from '../components/about/about'

const AutoplaySlider = withAutoplay(Slider)

const MainPage = () => {
    return (
        <>
            <Helmet>
                <meta name="description" content="Главная страница Туапсинского Гидрометеорологического Техникума" />
                <meta name="keywords" content="ТГМТ, тгмт, туапсинский гидрометеорологический техникум, главная страница тгмт" />
                <title>Главная | ТГМТ</title>
            </Helmet>
            <Header />
            <MobileHeader />
            <main id="wrap">
                <AutoplaySlider
                    cssModule={s}
                    play={ true }
                    cancelOnInteraction={ true }
                    interval={ 5000 }
                    className="news">
                        <div className="slide">
                            <img src={ bg } alt="bg" />
                        </div>
                        <div className="slide">
                            <img src={ bg } alt="bg" />
                        </div>
                        <div className="slide">
                            <img src={ bg } alt="bg" />
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