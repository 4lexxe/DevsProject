import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { NodeResizeControl } from '@xyflow/react';
import { Position, Handle, useUpdateNodeInternals } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import { useRotation } from "../hooks/useRotation";
export default function LineaNode({ id, selected, data: { borderColor = '#ccc', borderRadius = 0, layoutOrder = 1, measured = { width: 200, height: 2 }, }, }) {
    const { handleResize } = useNodeResize(id);
    const updateNodeInternals = useUpdateNodeInternals();
    const { rotation, rotateControlRef } = useRotation(0);
    useEffect(() => {
        updateNodeInternals(id);
    }, [rotation, id, updateNodeInternals]);
    return (_jsxs("div", { className: "react-flow__node-linea", style: {
            position: 'relative',
            zIndex: layoutOrder,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
        }, children: [_jsx("div", { style: {
                    width: `${measured.width}px`,
                    height: `${measured.height}px`,
                    backgroundColor: borderColor,
                    borderRadius: `${borderRadius}px`,
                } }), _jsx("div", { ref: rotateControlRef, className: "nodrag rotatable-node__handle", style: {
                    width: '10px',
                    height: '10px',
                    backgroundColor: selected ? 'red' : '',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    cursor: 'grab',
                } }), _jsx(NodeResizeControl, { minWidth: 50, minHeight: 2, position: "bottom-right", style: {
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
                    } })) }), _jsx(Handle, { type: "source", position: Position.Right, id: "right", style: { opacity: 0 } }), _jsx(Handle, { type: "target", position: Position.Left, id: "left", style: { opacity: 0 } })] }));
}
