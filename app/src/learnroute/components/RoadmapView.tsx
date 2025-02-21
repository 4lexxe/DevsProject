// RoadmapViewer.tsx
import { useMemo } from 'react';
import {
    Node,
    Edge,
    useNodes,
    useEdges,
  } from "@xyflow/react";

type RoadmapViewerProps = {
  nodes: Node[];
  edges: Edge[];
};

const RoadmapViewer = () => {

    const nodes = useNodes()
    const edges = useEdges()

  const dimensions = useMemo(() => {
    const padding = 50;
    const allX = nodes.map(n => n.position.x);
    const allY = nodes.map(n => n.position.y);
    return {
      width: Math.max(...allX) + padding,
      height: Math.max(...allY) + padding
    };
  }, [nodes]);

  return (
    <div className="relative w-full overflow-auto">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className="w-full h-full"
      >
        {/* Conexiones primero para que queden detrás de los nodos */}
        {edges.map(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (!sourceNode || !targetNode) return null;

          return (
            <path
              key={edge.id}
              d={`M ${sourceNode.position.x + 100} ${sourceNode.position.y + 50} L ${targetNode.position.x} ${targetNode.position.y + 50}`}
              stroke="#94a3b8"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {/* Nodos */}
        {nodes.map(node => (
          <g
            key={node.id}
            transform={`translate(${node.position.x}, ${node.position.y})`}
          >
            <rect
              width="200"
              height="100"
              rx="8"
              fill={typeof node.data?.backgroundColor === 'string' ? node.data.backgroundColor : '#ffffff'}
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            <foreignObject width="200" height="100" className="px-4 py-2">
              <div className="w-full h-full flex items-center justify-center">
                <h3 className="text-lg font-semibold text-center">
                  {node.data?.label as React.ReactNode}
                </h3>
              </div>
            </foreignObject>
          </g>
        ))}

        {/* Definición de la flecha */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default RoadmapViewer;