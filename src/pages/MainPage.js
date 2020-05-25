import React from "react"
import Helmet from "react-helmet"
import loadable from "@loadable/component"

const Header = loadable(() => import(/* webpackChunkName: "Header" */"components/header/header"))
const MobileHeader = loadable(() => import(/* webpackChunkName: "MobileHeader" */"components/mobile-header/mobile-header"))
const Resources = loadable(() => import(/* webpackChunkName: "Resources" */"components/resources/resources"))
const Footer = loadable(() => import(/* webpackChunkName: "Footer" */"components/footer/footer"))
const About = loadable(() => import(/* webpackChunkName: "About" */"components/about/about"))
const News = loadable(() => import(/* webpackChunkName: "News" */"components/news/news"))


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