import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NodeResizeControl, Position } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';
export default function Seccion({ id, selected, data: { borderColor = '#9C27B0', backgroundColor = 'rgba(156, 39, 176, 0.1)', borderRadius = 12, measured = { width: 400, height: 300 }, }, }) {
    // Obtenemos la función handleResize del hook personalizado
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs("div", { style: {
            border: `2px dashed ${borderColor}`,
            borderRadius: `${borderRadius}px`,
            backgroundColor,
            width: `${measured.width}px`,
            height: `${measured.height}px`,
            position: 'relative',
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx(NodeResizeControl, { minWidth: 200, minHeight: 150, position: "bottom-right", style: { background: 'transparent', border: 'none' }, onResize: handleResize, children: selected && (_jsx("div", { style: {
                        width: '10px',
                        height: '10px',
                        borderRight: `2px solid ${borderColor}`,
                        borderBottom: `2px solid ${borderColor}`,
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        cursor: 'se-resize',
                    } })) }), _jsx(BidirectionalHandle, { position: Position.Left, id: "left", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Right, id: "right", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Top, id: "top", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Bottom, id: "bottom", style: isHovered ? { opacity: 1 } : { opacity: 0 } })] }));
}
