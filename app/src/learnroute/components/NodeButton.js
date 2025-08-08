import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NodeResizeControl, Position } from "@xyflow/react";
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';
function NodeButton({ id, selected, data: { label, colorText = '#000000', borderColor = '#000', backgroundColor = '#facc15', fontSize = 16, layoutOrder = 0, borderRadius = 8, measured = { width: 200, height: 100 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsx("div", { className: 'relative h-full', children: _jsxs("div", { className: 'react-flow__nodeButton', style: {
                color: colorText,
                backgroundColor,
                fontSize: `${fontSize}px`,
                zIndex: layoutOrder, // Aplicar el orden del layout
                padding: '12px 20px',
                borderRadius: `${borderRadius}px`,
                border: `1px solid ${borderColor}`,
                width: `${measured.width}px`,
                height: `${measured.height}px`,
            }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("span", { className: "text-sm absolute", children: label }), _jsx(NodeResizeControl, { minWidth: 150, minHeight: 40, position: "bottom-right", onResize: handleResize, style: { background: 'transparent', border: 'none' }, children: selected && (_jsx("div", { style: {
                            width: '8px',
                            height: '8px',
                            borderRight: '2px solid #000',
                            borderBottom: '2px solid #000',
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            cursor: 'se-resize',
                        } })) }), _jsx(BidirectionalHandle, { position: Position.Left, id: "left", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Right, id: "right", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Top, id: "top", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Bottom, id: "bottom", style: isHovered ? { opacity: 1 } : { opacity: 0 } })] }) }));
}
export default NodeButton;
