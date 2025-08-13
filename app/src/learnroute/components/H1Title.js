import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { NodeResizeControl, Position } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
export default function H1Title({ id, selected, data: { label = "Título", colorText = "#000000", backgroundColor = "#ffffff", fontSize = 24, layoutOrder = 0, borderRadius = 8, borderColor = '#ccc', measured = { width: 300, height: 50 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs("div", { style: {
            color: colorText,
            backgroundColor,
            fontSize: `${fontSize}px`,
            width: `${measured.width}px`,
            height: `${measured.height}px`,
            borderRadius: `${borderRadius}px`,
            border: `1px solid ${borderColor}`,
            zIndex: layoutOrder,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontWeight: 'bold'
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [label, _jsx(NodeResizeControl, { minWidth: 150, minHeight: 40, position: "bottom-right", onResize: handleResize, style: { background: 'transparent', border: 'none' }, children: selected && (_jsx("div", { style: {
                        width: '10px',
                        height: '10px',
                        borderRight: '2px solid #000',
                        borderBottom: '2px solid #000',
                        position: 'absolute',
                        bottom: '2px',
                        right: '2px',
                        cursor: 'se-resize',
                    } })) }), _jsx(BidirectionalHandle, { position: Position.Left, id: "left", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Right, id: "right", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Top, id: "top", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Bottom, id: "bottom", style: isHovered ? { opacity: 1 } : { opacity: 0 } })] }));
}
