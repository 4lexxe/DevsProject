import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { NodeResizeControl } from '@xyflow/react';
import { Position } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';
export default function TopicNode({ id, selected, data: { label = '', colorText = '#000000', backgroundColor = '#ffffff', fontSize = 16, layoutOrder = 0, borderRadius = 8, borderColor = '#ccc', measured = { width: 200, height: 100 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const [isHovered, setIsHovered] = useState(false);
    return (_jsx("div", { className: "react-flow__node-topic", style: {
            color: colorText,
            backgroundColor,
            fontSize: `${fontSize}px`,
            zIndex: layoutOrder, // Aplicar el orden del layout
            padding: '12px 20px',
            borderRadius: `${borderRadius}px`,
            border: `$1px solid ${borderColor}`,
            width: `${measured.width}px`,
            height: `${measured.height}px`,
            position: 'relative', // Necesario para los controles de redimensionado
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: _jsxs(_Fragment, { children: [_jsx(NodeResizeControl, { minWidth: 50, minHeight: 30, position: "bottom-right", style: {
                        background: 'transparent',
                        border: 'none',
                        cursor: 'se-resize',
                    }, onResize: handleResize, children: selected && (_jsx("div", { style: {
                            width: '10px',
                            height: '10px',
                            borderRight: `2px solid ${borderColor}`,
                            borderBottom: `2px solid ${borderColor}`,
                            position: 'absolute',
                            bottom: '2px',
                            right: '2px',
                            cursor: 'se-resize',
                        } })) }), _jsx("div", { children: label }), _jsx(BidirectionalHandle, { position: Position.Left, id: "left", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Right, id: "right", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Top, id: "top", style: isHovered ? { opacity: 1 } : { opacity: 0 } }), _jsx(BidirectionalHandle, { position: Position.Bottom, id: "bottom", style: isHovered ? { opacity: 1 } : { opacity: 0 } })] }) }));
}
