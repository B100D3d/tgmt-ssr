import React from "react"
import Helmet from "react-helmet"

import Header from "components/header/header"
import MobileHeader from "components/mobile-header/mobile-header"
import Resources from "components/resources/resources"
import Footer from "components/footer/footer"
import About from "components/about/about"
import News from "components/news/news"
import ToTopButton from "components/to-top-button/to-top-button"
import AboutApp from "components/about-app/about-app"

const MainPage = () => {
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Главная страница Туапсинского Гидрометеорологического Техникума"
                />
                <meta
                    name="keywords"
                    content="ТГМТ, тгмт, туапсинский гидрометеорологический техникум, главная страница тгмт"
                />
                <title>Главная | ТГМТ</title>
            </Helmet>
            <Header />
            <MobileHeader />
            <main>
                <News />
                <About />
                <Resources />
                <Footer />
            </main>
            <ToTopButton />
            <AboutApp />
        </>
    )
}

export default MainPage
