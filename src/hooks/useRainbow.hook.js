import { useState, useEffect, useRef } from 'react';

function generateId(len = 4) {
    const alfs = "abcdefghijklmnopqrstuvwxyz";
    let id = "";
    for (let i = 0; i < len; i++) {
        id += alfs[Math.floor(Math.random() * alfs.length)]
    }
    return id;
}

function useIncremetingNumber(interval) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setCount(count + 1), interval);
        return () => clearTimeout(timer);
    }, [count, interval])

    return count;
}

const rainbowColors = [
    '#B326FF', // левый цвет алисы
    '#5F26FF', // правый цвет алисы
    'hsl(240deg, 100%, 45%)', // indigo
    'hsl(260deg, 100%, 55%)', // violet
    'hsl(325deg, 100%, 48%)', // pink
    'hsl(177deg, 100%, 35%)', // aqua
    'hsl(230deg, 100%, 45%)', // blue
    
];

const paletteSize = rainbowColors.length;

const range = [0, 1, 2];

const hasBrowserSupport =
  typeof window !== 'undefined'
    ? typeof window.CSS.registerProperty === 'function'
    : false;


const getColorName = (id, index) => `--rainbow-color-${id}-${index}`;


const useRainbow = (interval) => {

    const prefersReducedMotion =
    typeof window === 'undefined'
      ? true
      : window.matchMedia('(prefers-reduced-motion: no-preference)');

    const isEnabled = hasBrowserSupport && prefersReducedMotion.matches;

    const { current: uniqueId } = useRef(generateId()) // => { current: 'asdf' }

    useEffect(() => {
        if (!isEnabled) return
        range.map(index => {
            const name = getColorName(uniqueId, index);
            const initialValue = rainbowColors[index];

            CSS.registerProperty({
                name,
                initialValue,
                syntax: '<color>',
                inherits: false,
            });
        })
    }, [isEnabled]);

    const intervalCount = useIncremetingNumber(interval);

    return range.reduce((acc, index) => {
        const eIntervalCount = isEnabled ? intervalCount : 0;
        const name = getColorName(uniqueId, index);
        const value = rainbowColors[(eIntervalCount + index) % paletteSize];
        return {
            ...acc,
            [name]: value
        }
    }, {})

}

export default useRainbow;