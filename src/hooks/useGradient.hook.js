import { useState, useEffect, useRef } from 'react'


const CSS_GRADIENTS = [{
        deg: "140.26deg",
        "--1-gradient-0": {
            color: "#833AB4",
            percent: "15.21%"
        },
        "--1-gradient-1": {
            color: "#FD1D1D",
            percent: "55.24%"
        },
        "--1-gradient-2": {
            color: "#FCB045",
            percent: "96.99%"
        }
    },
    {
        deg: "120.83deg",
        "--2-gradient-0": {
            color: "#00C6FF",
            percent: "5.28%"
        },
        "--2-gradient-1": {
            color: "#0072FF",
            percent: "86.14%"
        },
        "--2-gradient-2": {
            color: "#0072FF",
            percent: "86.14%"
        }
    }
]

const noDeg = ({ deg, ...rest }) => rest

const initialValue = "#201E1E"

const getCSSGradient = () => {
    const length = CSS_GRADIENTS.length
    const gradient = CSS_GRADIENTS[Math.floor(Math.random() * length)]
    return gradient
}

const getDefaultGradient = gradient => {
    const { deg } = gradient

    const defGradient = {}

    for (const name in noDeg(gradient)) {
        defGradient[name] = {
            ...gradient[name],
            color: initialValue
        }
    }

    return { ...defGradient, deg }
}

const hasBrowserSupport =
    typeof window !== 'undefined' ?
    typeof window.CSS.registerProperty === 'function' :
    false

const prefersReducedMotion =
    typeof window === 'undefined' ?
    true :
    window.matchMedia('(prefers-reduced-motion: no-preference)')

const useGradient = () => {

    const [isHover, setHover] = useState(false)
    const gradient = useRef(getCSSGradient())
    const defGradient = useRef(getDefaultGradient(gradient.current))

    const isEnabled = hasBrowserSupport && prefersReducedMotion.matches

    useEffect(() => {
        if (isEnabled) {
            for (const name in noDeg(gradient.current)) {
                try {
                    CSS.registerProperty({
                        name,
                        initialValue,
                        syntax: '<color>',
                        inherits: false,
                    })
                } catch (err) {

                }
            }
        }
    }, [isEnabled])

    return isHover ? [gradient.current, setHover] : [defGradient.current, setHover]
}

export default useGradient