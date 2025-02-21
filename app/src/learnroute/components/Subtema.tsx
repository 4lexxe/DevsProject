import { NodeProps, Position, NodeResizeControl, Node } from '@xyflow/react';
import { SubtemaNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';

type CustomComponentNode = Node<SubtemaNodeData, 'string'>;


// Subtema.tsx
export default function Subtema({
  id,
  selected,
  data: {
    label = '',
    colorText = '#2d3436',
    backgroundColor = '#f5f6fa',
    fontSize = 14,
    layoutOrder = 0,
    borderRadius = 6,
    borderColor = '#a4b0be',
    measured = { width: 200, height: 100 },
  }
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        color: colorText,
        fontSize: `${fontSize}px`,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        border: `2px dashed ${borderColor}`,  // Borde discontinuo
        position: 'relative',
        zIndex: layoutOrder,
        fontStyle: 'italic',  // Texto en cursiva
        padding: '8px 12px',  // Padding diferente
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizeControl
        minWidth={120}
        minHeight={40}
        position="bottom-right"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'se-resize',
        }}
        onResize={handleResize}
      >
        {selected && (

        <div style={{
          width: '12px',
          height: '12px',
          border: `2px solid ${borderColor}`,  // Cuadrado completo
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          background: '#fff',
          borderRadius: '2px',
          cursor: 'se-resize'
        }} />
        )}
      </NodeResizeControl>

      <div style={{ padding: '4px 0' }}>{label}</div>
      <BidirectionalHandle position={Position.Left} id="left" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Right} id="right" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Top} id="top" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Bottom} id="bottom" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
    </div>
  );
}