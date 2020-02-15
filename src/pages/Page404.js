import React from 'react';
import Lottie from 'react-lottie';

import anim from '../img/404page.json';

const Page404 = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: anim,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        <Lottie options={ defaultOptions }
        width="100%"
        height="100vh"
        isStopped={ false }
        isClickToPauseDisabled={ true }
        isPaused={ false } />
    )
}

export default Page404;