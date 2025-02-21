import { NodeProps, NodeResizeControl, Node, Position } from '@xyflow/react';
import { SeccionNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';

type CustomComponentNode = Node<SeccionNodeData>;

export default function Seccion({
  id,
  selected,
  data: {
    borderColor = '#9C27B0',
    backgroundColor = 'rgba(156, 39, 176, 0.1)',
    borderRadius = 12,
    measured = { width: 400, height: 300 },
  },
}: NodeProps<CustomComponentNode>) {
  // Obtenemos la función handleResize del hook personalizado
  const { handleResize } = useNodeResize(id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        backgroundColor,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        position: 'relative',
        
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <NodeResizeControl
        minWidth={200}
        minHeight={150}
        position="bottom-right"
        style={{ background: 'transparent', border: 'none' }}
        onResize={handleResize}
      >
        {selected && (

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
        )}
      </NodeResizeControl>
      <BidirectionalHandle position={Position.Left} id="left" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Right} id="right" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Top} id="top" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Bottom} id="bottom" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
    </div>
  );
}
