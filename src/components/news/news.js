import React from "react"

import Slider from "react-awesome-slider"
import withAutoplay from "react-awesome-slider/dist/autoplay"

import bg from "/static/1.webp"

import sliderS from "react-awesome-slider/src/core/styles.scss"
import s from "./news.module.sass"

const AutoplaySlider = withAutoplay(Slider)


const News = () => (
    <AutoplaySlider
        cssModule={ sliderS }
        play={ true }
        cancelOnInteraction={ true }
        interval={ 8000 }
        className={ s.news }>
            <div className={ s.slide } data-src={ bg }>
            </div>
            <div className={ s.slide } data-src={ bg }>
            </div>
    </AutoplaySlider>
)

export default News