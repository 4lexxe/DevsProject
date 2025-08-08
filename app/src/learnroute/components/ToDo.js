import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { NodeResizeControl, Position } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
export default function ToDo({ id, selected, data: { label = "Tarea pendiente", colorText = "#000000", backgroundColor = "#ffffff", fontSize = 16, measured = { width: 300, height: 60 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const [checked, setChecked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsxs("div", { style: {
            display: 'flex',
            alignItems: 'center',
            color: colorText,
            backgroundColor,
            fontSize: `${fontSize}px`,
            width: `${measured.width}px`,
            height: `${measured.height}px`,
            padding: '10px',
            border: '1px solid #ccc',
            position: 'relative',
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("input", { type: "checkbox", checked: checked, onChange: () => setChecked(!checked), style: { marginRight: '10px' } }), _jsx("span", { style: { textDecoration: checked ? 'line-through' : 'none' }, children: label }), _jsx(NodeResizeControl, { minWidth: 150, minHeight: 40, position: "bottom-right", onResize: handleResize, style: { background: 'transparent', border: 'none' }, children: selected && (_jsx("div", { style: {
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
