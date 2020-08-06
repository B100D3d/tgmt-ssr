import { useEffect, useState } from "react"
import { range, registerCSSColorProperty } from "utils"
import useIncrementingNumber from "./useIncrementingNumber"

const rainbowColors = [
    "#B326FF", // левый цвет алисы
    "#5F26FF", // правый цвет алисы
    "hsl(240deg, 100%, 45%)", // indigo
    "hsl(260deg, 100%, 55%)", // violet
    "hsl(325deg, 100%, 48%)", // pink
    "hsl(177deg, 100%, 35%)", // aqua
    "hsl(230deg, 100%, 45%)", // blue
]

const VISIBLE_COLORS_COUNT = 3

const paletteSize = rainbowColors.length

const getColorName = (index) => `--rainbow-color-${index}`

const useRainbow = (interval) => {

    const [isEnabled, setEnabled] = useState(false)

    useEffect(() => {
        range(VISIBLE_COLORS_COUNT).forEach(index => {
            const name = getColorName(index)
            const initialValue = rainbowColors[index]
            const isEnabled = registerCSSColorProperty(name, initialValue)
            setEnabled(isEnabled)
        })
    }, [])

    const intervalCount = useIncrementingNumber(interval)

    return range(VISIBLE_COLORS_COUNT).reduce((acc, index) => {
        const eIntervalCount = isEnabled ? intervalCount : 0
        const name = getColorName(index)
        const value = rainbowColors[(eIntervalCount + index) % paletteSize]
        return {
            ...acc,
            [name]: value
        }
    }, {})
}

export default useRainbow