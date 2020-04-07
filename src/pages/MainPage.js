import React from "react"
import Helmet from "react-helmet"
import loadable from "@loadable/component"

const Header = loadable(() => import("/components/header/header"))
const MobileHeader = loadable(() => import("/components/mobile-header/mobile-header"))
const Resources = loadable(() => import("/components/resources/resources"))
const Footer = loadable(() => import("/components/footer/footer"))
const About = loadable(() => import("/components/about/about"))
const News = loadable(() => import("/components/news/news"))


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
            <main>
                <News />
                <About />
                <Resources />
                <Footer />
            </main>
        </>
    )
}

export default MainPage