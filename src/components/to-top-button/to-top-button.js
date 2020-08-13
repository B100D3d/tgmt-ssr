import React, { useEffect, useState } from "react"
import { CSSTransition } from "react-transition-group"
import CircleButton from "components/circle-button/circle-button"
import useScroll from "hooks/useScroll"

import "./to-top-button.sass"
import top from "static/previous.svg"

const ToTopButton = () => {
    const scroll = useScroll()
    const [isShow, setShow] = useState(false)

    const handleClick = () => window.scrollTo({ top: 0, behavior: "smooth" })

    useEffect(() => {
        setShow(scroll > 300)
    }, [scroll])

    return (
        <CSSTransition
            in={isShow}
            classNames="slide"
            timeout={500}
            unmountOnExit
        >
            <CircleButton
                className="to-top-button"
                img={top}
                onClick={handleClick}
            />
        </CSSTransition>
    )
}

export default ToTopButton
