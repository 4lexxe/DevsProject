import { useEffect, useState, useRef } from "react";
import { select } from "d3-selection";
import { drag } from "d3-drag";
export function useRotation(initialRotation = 0) {
    const [rotation, setRotation] = useState(initialRotation);
    const rotateControlRef = useRef(null);
    useEffect(() => {
        if (!rotateControlRef.current)
            return;
        // Tipamos la selección para que sepa que trabajamos con un HTMLDivElement
        const selection = select(rotateControlRef.current);
        // Tipamos el dragHandler para que trabaje con HTMLDivElement
        const dragHandler = drag().on("drag", (evt) => {
            const dx = evt.x - 100;
            const dy = evt.y - 100;
            const rad = Math.atan2(dx, dy);
            const deg = rad * (180 / Math.PI);
            setRotation(180 - deg);
        });
        selection.call(dragHandler);
        return () => {
            selection.on(".drag", null);
        };
    }, []);
    return { rotation, rotateControlRef };
}
