import React from 'react';
import Lottie from 'react-lottie';


import anim from './loading.json';


const Loading = ({ width, height, loading }) => {

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
        width={ width }
        height={ height }
        isStopped={ !loading }
        isClickToPauseDisabled={ true }
        isPaused={ false } />
    )
}

export default Loading;