import React from "react"
import loadable from "@loadable/component"

import anim from "static/loading.json"

const Lottie = loadable(() =>
    import(/* webpackChunkName: "Lottie" */ "components/lottie/lottie")
)

const Loading = ({ width, height, loading }) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: anim,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    return (
        <Lottie
            options={defaultOptions}
            width={width}
            height={height}
            isStopped={!loading}
            isClickToPauseDisabled={true}
            isPaused={false}
        />
    )
}

export default Loading
