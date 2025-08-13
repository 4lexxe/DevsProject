import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NodeResizeControl, Position } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';
export default function Link({ id, selected, data: { label = "Enlace", colorText = "#007bff", backgroundColor = "#ffffff", borderColor = "#007bff", borderRadius = 4, fontSize = 14, layoutOrder = 0, content = "https://example.com", measured = { width: 200, height: 50 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    const handleClick = () => {
        window.open(content, '_blank');
    };
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
            cursor: 'pointer',
            position: 'relative',
            zIndex: layoutOrder,
        }, onClick: handleClick, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [label, _jsx(NodeResizeControl, { minWidth: 150, minHeight: 40, position: "bottom-right", onResize: handleResize, style: { background: 'transparent', border: 'none' }, children: selected && (_jsx("div", { style: {
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
