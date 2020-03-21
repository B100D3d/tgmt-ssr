import React from 'react';
import Loadable from 'react-loadable';

import Helmet from 'react-helmet';
import Slider from 'react-awesome-slider';
import withAutoplay from 'react-awesome-slider/dist/autoplay';

import Header from '../components/header/header';
import MobileHeader from '../components/mobile-header/mobile-header';
import Resources from '../components/resources/resources';

import useStyles from 'isomorphic-style-loader/useStyles'

import bg from '../img/1.jpg';
import Footer from '../components/footer/footer';
import s from 'react-awesome-slider/src/styles';

const About = Loadable({
    loader: () => import('../components/about/about'),
    loading: () => (<></>)
})

const AutoplaySlider = withAutoplay(Slider)

const MainPage = () => {
    useStyles(s)
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