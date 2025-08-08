import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// RoadmapViewer.tsx
import { useMemo } from 'react';
import { useNodes, useEdges, } from "@xyflow/react";
const RoadmapViewer = () => {
    const nodes = useNodes();
    const edges = useEdges();
    const dimensions = useMemo(() => {
        const padding = 50;
        const allX = nodes.map(n => n.position.x);
        const allY = nodes.map(n => n.position.y);
        return {
            width: Math.max(...allX) + padding,
            height: Math.max(...allY) + padding
        };
    }, [nodes]);
    return (_jsx("div", { className: "relative w-full overflow-auto", children: _jsxs("svg", { viewBox: `0 0 ${dimensions.width} ${dimensions.height}`, className: "w-full h-full", children: [edges.map(edge => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode)
                        return null;
                    return (_jsx("path", { d: `M ${sourceNode.position.x + 100} ${sourceNode.position.y + 50} L ${targetNode.position.x} ${targetNode.position.y + 50}`, stroke: "#94a3b8", strokeWidth: "2", fill: "none", markerEnd: "url(#arrow)" }, edge.id));
                }), nodes.map(node => (_jsxs("g", { transform: `translate(${node.position.x}, ${node.position.y})`, children: [_jsx("rect", { width: "200", height: "100", rx: "8", fill: typeof node.data?.backgroundColor === 'string' ? node.data.backgroundColor : '#ffffff', stroke: "#cbd5e1", strokeWidth: "2" }), _jsx("foreignObject", { width: "200", height: "100", className: "px-4 py-2", children: _jsx("div", { className: "w-full h-full flex items-center justify-center", children: _jsx("h3", { className: "text-lg font-semibold text-center", children: node.data?.label }) }) })] }, node.id))), _jsx("defs", { children: _jsx("marker", { id: "arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "6", markerHeight: "6", orient: "auto-start-reverse", children: _jsx("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "#94a3b8" }) }) })] }) }));
};
export default RoadmapViewer;
