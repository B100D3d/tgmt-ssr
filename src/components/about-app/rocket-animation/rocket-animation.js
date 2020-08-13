import React from "react"
import loadable from "@loadable/component"

const Lottie = loadable(() =>
    import(/* webpackChunkName: "Lottie" */ "components/lottie/lottie")
)

import rocket from "static/rocket.json"

const RocketAnimation = () => (
    <Lottie
        options={{
            loop: true,
            autoplay: true,
            animationData: rocket,
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
            },
        }}
        width={200}
        height={200}
        isStopped={false}
        isClickToPauseDisabled={true}
        isPaused={false}
    />
)

export default RocketAnimation
