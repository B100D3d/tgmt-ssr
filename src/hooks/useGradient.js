import { useState, useEffect, useRef, useContext } from "react"

import { UserMenuOpenContext } from "context"
import { registerCSSColorProperty } from "utils"


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
    },
    {
        deg: "32.17deg",
        "--3-gradient-0": {
            color: "#ffafbd",
            percent: "16.39%"
        },
        "--3-gradient-1": {
            color: "#FFC3A0",
            percent: "94.79%"
        },
        "--3-gradient-2": {
            color: "#FFC3A0",
            percent: "94.79%"
        }
    },
    {
        deg: "113.61deg",
        "--4-gradient-0": {
            color: "rgba(33, 147, 176, 0.78)",
            percent: "2.41%"
        },
        "--4-gradient-1": {
            color: "#6DD5ED",
            percent: "82.54%"
        },
        "--4-gradient-2": {
            color: "#6DD5ED",
            percent: "82.54%"
        }
    },
    {
        deg: "113.17deg",
        "--5-gradient-0": {
            color: "#CC2B5E",
            percent: "6.64%"
        },
        "--5-gradient-1": {
            color: "#753A88",
            percent: "91.63%"
        },
        "--5-gradient-2": {
            color: "#753A88",
            percent: "91.63%"
        }
    },
    {
        deg: "26.52deg",
        "--6-gradient-0": {
            color: "#42275A",
            percent: "4.61%"
        },
        "--6-gradient-1": {
            color: "#734B6D",
            percent: "79.48%"
        },
        "--6-gradient-2": {
            color: "#734B6D",
            percent: "79.48%"
        }
    },
    {
        deg: "127.43deg",
        "--7-gradient-0": {
            color: "#4568DC",
            percent: "-13.98%"
        },
        "--7-gradient-1": {
            color: "#B06AB3",
            percent: "106.19%"
        },
        "--7-gradient-2": {
            color: "#B06AB3",
            percent: "106.19%"
        }
    },
    {
        deg: "68.5deg",
        "--8-gradient-0": {
            color: "#3A1C71",
            percent: "-12.91%"
        },
        "--8-gradient-1": {
            color: "#D76D77",
            percent: "70.94%"
        },
        "--8-gradient-2": {
            color: "#FFAF7B",
            percent: "106.42%"
        }
    },
    {
        deg: "75.96deg",
        "--9-gradient-0": {
            color: "#8E0E00",
            percent: "7.45%"
        },
        "--9-gradient-1": {
            color: "#1F1C18",
            percent: "104.06%"
        },
        "--9-gradient-2": {
            color: "#1F1C18",
            percent: "104.06%"
        }
    },
    {
        deg: "47.04deg",
        "--10-gradient-0": {
            color: "#673AB7",
            percent: "2.42%"
        },
        "--10-gradient-1": {
            color: "#512DA8",
            percent: "87.95%"
        },
        "--10-gradient-2": {
            color: "#512DA8",
            percent: "87.95%"
        }
    },
    {
        deg: "126.64deg",
        "--11-gradient-0": {
            color: "#00C9FF",
            percent: "27.34%"
        },
        "--11-gradient-1": {
            color: "#92FE9D",
            percent: "99.12%"
        },
        "--11-gradient-2": {
            color: "#92FE9D",
            percent: "99.12%"
        }
    },
    {
        deg: "21.09deg",
        "--12-gradient-0": {
            color: "#E53935",
            percent: "6.21%"
        },
        "--12-gradient-1": {
            color: "#E35D5B",
            percent: "89.11%"
        },
        "--12-gradient-2": {
            color: "#E35D5B",
            percent: "89.11%"
        }
    },
    {
        deg: "40.13deg",
        "--13-gradient-0": {
            color: "#FC00FF",
            percent: "0%"
        },
        "--13-gradient-1": {
            color: "#00DBDE",
            percent: "95.9%"
        },
        "--13-gradient-2": {
            color: "#00DBDE",
            percent: "95.9%"
        }
    },
    {
        deg: "35.83deg",
        "--14-gradient-0": {
            color: "#EE9CA7",
            percent: "13.46%"
        },
        "--14-gradient-1": {
            color: "#00DBDE",
            percent: "134.9%"
        },
        "--14-gradient-2": {
            color: "#00DBDE",
            percent: "134.9%"
        }
    },
    {
        deg: "70.97deg",
        "--15-gradient-0": {
            color: "#7B4397",
            percent: "7.08%"
        },
        "--15-gradient-1": {
            color: "#DC2430",
            percent: "135.72%"
        },
        "--15-gradient-2": {
            color: "#DC2430",
            percent: "135.72%"
        }
    },
    {
        deg: "32.92deg",
        "--16-gradient-0": {
            color: "#00BF8F",
            percent: "3.74%"
        },
        "--16-gradient-1": {
            color: "#001510",
            percent: "110.54%"
        },
        "--16-gradient-2": {
            color: "#001510",
            percent: "110.54%"
        }
    },
    {
        deg: "42.91deg",
        "--17-gradient-0": {
            color: "#FEAC5E",
            percent: "-13.89%"
        },
        "--17-gradient-1": {
            color: "#C779D0",
            percent: "54.69%"
        },
        "--17-gradient-2": {
            color: "#4BC0C8",
            percent: "97.7%"
        }
    },
    {
        deg: "57.48deg",
        "--18-gradient-0": {
            color: "#6441A5",
            percent: "-0.31%"
        },
        "--18-gradient-1": {
            color: "#2A0845",
            percent: "113.78%"
        },
        "--18-gradient-2": {
            color: "#2A0845",
            percent: "113.78%"
        }
    },
    {
        deg: "78.56deg",
        "--19-gradient-0": {
            color: "rgba(54, 0, 51, 0.74)",
            percent: "4.25%"
        },
        "--19-gradient-1": {
            color: "#0B8793",
            percent: "91.55%"
        },
        "--19-gradient-2": {
            color: "#0B8793",
            percent: "91.55%"
        }
    },
    {
        deg: "122.33deg",
        "--20-gradient-0": {
            color: "#FE8C00",
            percent: "18.34%"
        },
        "--20-gradient-1": {
            color: "#F83600",
            percent: "126.64%"
        },
        "--20-gradient-2": {
            color: "#F83600",
            percent: "126.64%"
        }
    },
    {
        deg: "47.98deg",
        "--21-gradient-0": {
            color: "#B3FFAB",
            percent: "5.83%"
        },
        "--21-gradient-1": {
            color: "#12FFF7",
            percent: "96.39%"
        },
        "--21-gradient-2": {
            color: "#12FFF7",
            percent: "96.39%"
        }
    },
    {
        deg: "21.62deg",
        "--22-gradient-0": {
            color: "#B993D6",
            percent: "8.06%"
        },
        "--22-gradient-1": {
            color: "#8CA6DB",
            percent: "92.92%"
        },
        "--22-gradient-2": {
            color: "#8CA6DB",
            percent: "92.92%"
        }
    },
    {
        deg: "253.64deg",
        "--23-gradient-0": {
            color: "#F857A6",
            percent: "8.43%"
        },
        "--23-gradient-1": {
            color: "#FF5858",
            percent: "91.12%"
        },
        "--23-gradient-2": {
            color: "#FF5858",
            percent: "91.12%"
        }
    },
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

const useGradient = () => {

    const [isHover, setHover] = useState(false)
    const [isOpen] = useContext(UserMenuOpenContext)
    const gradient = useRef(getCSSGradient())
    const defGradient = useRef(getDefaultGradient(gradient.current))

    useEffect(() => {
        for (const name in noDeg(gradient.current)) {
            registerCSSColorProperty(name, initialValue)
        }
    }, [gradient.current])

    useEffect(() => {
        gradient.current = getCSSGradient()
        defGradient.current = getDefaultGradient(gradient.current)
    }, [isOpen])

    return isHover ? [gradient.current, setHover] : [defGradient.current, setHover]
}

export default useGradient