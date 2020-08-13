export const timeout = (ms) => new Promise((r) => setTimeout(r, ms))

export const range = (size, start = 0) =>
    [...Array(size).keys()].map((key) => key + start)

export const getCookies = (namesList) =>
    document.cookie
        .split(";")
        .map((c) => c.trim())
        .map((c) => c.split("="))
        .filter(([key]) => namesList?.includes(key))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})

export const generateId = (len = 5) => {
    const alfs = "abcdefghijklmnopqrstuvwxyz1234567890"
    let id = ""
    for (let i = 0; i < len; i++) {
        id += alfs[Math.floor(Math.random() * alfs.length)]
    }
    return id
}

export const registerCSSColorProperty = (name, initialValue) => {
    const hasBrowserSupport =
        typeof window !== "undefined"
            ? typeof window.CSS.registerProperty === "function"
            : false
    const prefersReducedMotion =
        typeof window === "undefined"
            ? true
            : window.matchMedia("(prefers-reduced-motion: no-preference)")
    const isEnabled = hasBrowserSupport && prefersReducedMotion.matches

    if (isEnabled) {
        try {
            CSS.registerProperty({
                name,
                initialValue,
                syntax: "<color>",
                inherits: false,
            })
        } catch {}
    }
    return isEnabled
}
