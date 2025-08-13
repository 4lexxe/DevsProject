import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Position, NodeResizeControl } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';
// Subtema.tsx
export default function Subtema({ id, selected, data: { label = '', colorText = '#2d3436', backgroundColor = '#f5f6fa', fontSize = 14, layoutOrder = 0, borderRadius = 6, borderColor = '#a4b0be', measured = { width: 200, height: 100 }, } }) {
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs("div", { style: {
            color: colorText,
            fontSize: `${fontSize}px`,
            backgroundColor,
            borderRadius: `${borderRadius}px`,
            width: `${measured.width}px`,
            height: `${measured.height}px`,
            border: `2px dashed ${borderColor}`, // Borde discontinuo
            position: 'relative',
            zIndex: layoutOrder,
            fontStyle: 'italic', // Texto en cursiva
            padding: '8px 12px', // Padding diferente
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx(NodeResizeControl, { minWidth: 120, minHeight: 40, position: "bottom-right", style: {
                    background: 'transparent',
                    border: 'none',
                    cursor: 'se-resize',
                }, onResize: handleResize, children: selected && (_jsx("div", { style: {
                        width: '12px',
                        height: '12px',
                        border: `2px solid ${borderColor}`, // Cuadrado completo
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        background: '#fff',
                        borderRadius: '2px',
                        cursor: 'se-resize'
                    } })) }), _jsx("div", { style: { padding: '4px 0' }, children: label }), _jsx(BidirectionalHandle, { position: Position.Left, id: "left", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Right, id: "right", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Top, id: "top", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Bottom, id: "bottom", style: isHovered ? { opacity: 1 } : { opacity: 0 } })] }));
}
