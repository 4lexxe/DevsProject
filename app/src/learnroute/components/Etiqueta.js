import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { NodeResizeControl, Position } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
export default function Etiqueta({ id, selected, data: { label = "Etiqueta", colorText = "#000000", backgroundColor = "#f5f5f5", borderColor = "#ccc", borderRadius = 4, fontSize = 14, layoutOrder = 0, measured = { width: 200, height: 40 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs("div", { style: {
            color: colorText,
            backgroundColor,
            fontSize: `${fontSize}px`,
            border: `1px solid ${borderColor}`,
            borderRadius: `${borderRadius}px`,
            width: `${measured.width}px`,
            height: `${measured.height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: layoutOrder,
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [label, _jsx(NodeResizeControl, { minWidth: 100, minHeight: 30, position: "bottom-right", onResize: handleResize, style: { background: 'transparent', border: 'none' }, children: selected && (_jsx("div", { style: {
                        width: '8px',
                        height: '8px',
                        borderRight: '2px solid #000',
                        borderBottom: '2px solid #000',
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        cursor: 'se-resize',
                    } })) }), _jsx(BidirectionalHandle, { position: Position.Left, id: "left", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Right, id: "right", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Top, id: "top", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Bottom, id: "bottom", style: isHovered ? { opacity: 1 } : { opacity: 0 } })] }));
}
