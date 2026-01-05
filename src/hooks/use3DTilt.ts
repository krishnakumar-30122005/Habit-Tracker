import { useState, useCallback, useRef, useEffect, type MouseEvent } from 'react';

export const use3DTilt = (intensity = 15) => {
    const [style, setStyle] = useState({});
    const requestRef = useRef<number | null>(null);
    const targetRef = useRef({ x: 0, y: 0 });

    const animate = useCallback(() => {
        const { x, y } = targetRef.current;
        const tiltX = (0.5 - y) * intensity;
        const tiltY = (x - 0.5) * intensity;

        setStyle({
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out' // Smooth out the jumps
        });

        // We only animate when there's a change ideally, but for now simplest RAF
        // actually, we don't need continuous loop if we just set state in RAF from mouse event
    }, [intensity]);

    const onMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();

        const x = (clientX - left) / width;
        const y = (clientY - top) / height;

        targetRef.current = { x, y };

        if (!requestRef.current) {
            requestRef.current = requestAnimationFrame(() => {
                animate();
                requestRef.current = null;
            });
        }
    }, [animate]);

    const onMouseLeave = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }

        setStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.5s ease-out'
        });
    }, []);

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return { style, onMouseMove, onMouseLeave };
};
