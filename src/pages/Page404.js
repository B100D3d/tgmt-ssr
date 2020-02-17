import React, { useEffect, useState } from 'react';
import Lottie from 'react-lottie';

import anim from '../img/404page.json';

const Page404 = () => {
    const [defaultOptions, setDefaultOptions] = useState({});

    useEffect(() => {
        const viewBoxSize = window.innerWidth < 800 ? "200 0 600 512" : "0 0 1024 512"
        setDefaultOptions({
            loop: true,
            autoplay: true,
            animationData: anim,
            rendererSettings: {
                preserveAspectRatio: 'none',
                viewBoxSize
            }
        })
    }, []);

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