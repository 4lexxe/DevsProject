import React, {useRef, useState, useEffect } from 'react';
import { NodeResizeControl } from '@xyflow/react';
import { Node, NodeProps, Position, Handle, useUpdateNodeInternals  } from '@xyflow/react';
import { useNodeResize } from '../hooks/useNodeResize';
import type { LineNodeData } from '../types/CustomComponentType';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';

type CustomComponentNode = Node<LineNodeData, 'string'>;

export default function LineaNode({
  id,
  data: {
    borderColor = '#ccc',
    borderRadius = 0,
    layoutOrder = 1,
    length, // Longitud específica, si se provee
    measured = { width: 200, height: 2 }, // width: longitud; height: grosor
  },
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);
  const rotateControlRef = useRef(null);
  const updateNodeInternals = useUpdateNodeInternals();
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!rotateControlRef.current) {
      return;
    }
 
    const selection = select<Element, unknown>(rotateControlRef.current);
    const dragHandler = drag().on('drag', (evt) => {
      const dx = evt.x - 100;
      const dy = evt.y - 100;
      const rad = Math.atan2(dx, dy);
      const deg = rad * (180 / Math.PI);
      setRotation(180 - deg);
      updateNodeInternals(id);
    });
 
    selection.call(dragHandler);
  }, [id, updateNodeInternals]);

  // Si se define 'length', se utiliza; de lo contrario se usa measured.width
  const lineLength = length || measured.width;
  const thickness = measured.height;

  const lineStyle: React.CSSProperties = {
    width: `${lineLength}px`,
    height: `${thickness}px`,
    backgroundColor: borderColor,
    borderRadius: `${borderRadius}px`,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: 'center',
  };

  return (
    <div
      className="react-flow__node-linea"
      style={{
        position: 'relative',
        zIndex: layoutOrder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${rotation}deg)`
      }}
    >
      {/* Renderiza la línea */}
      <div style={lineStyle}></div>
      
      {/* Control de redimensionado para modificar longitud y grosor */}
      <NodeResizeControl
        minWidth={50}
        minHeight={2}
        position="bottom-right"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'se-resize',
        }}
        onResize={handleResize}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRight: `2px solid ${borderColor}`,
            borderBottom: `2px solid ${borderColor}`,
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            cursor: 'se-resize',
          }}
        />
      </NodeResizeControl>
      
      {/* Handles ocultos para permitir conexiones si fuera necesario */}
      <Handle type="source" position={Position.Right} id="right" style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Left} id="left" style={{ opacity: 0 }} />
    </div>
  );
}
