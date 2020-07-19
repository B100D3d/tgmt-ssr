import { useEffect, useState } from "react"

export default function useIncrementingNumber(interval) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), interval)
        return () => clearTimeout(timer)
    }, [count, interval])

    return count
}