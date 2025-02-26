import { NodeResizeControl  } from '@xyflow/react';
import { Node, NodeProps, Position } from '@xyflow/react';
import { TemaNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';

type CustomComponentNode = Node<TemaNodeData, 'string'>;

export default function TopicNode({
  id,
  selected,
  data: { 
    label='', 
    colorText = '#000000', 
    backgroundColor = '#ffffff', 
    fontSize = 16, 
    layoutOrder = 0 ,
    borderRadius=8 ,
    borderColor= '#ccc',
    measured = { width: 200, height: 100 },
    
  },
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="react-flow__node-topic"
      style={{
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
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <>
      
      <NodeResizeControl
        minWidth={50}
        minHeight={30}
        position="bottom-right"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'se-resize',
        }}
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

      <div>{label}</div>
      <BidirectionalHandle position={Position.Left} id="left" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Right} id="right" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Top} id="top" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Bottom} id="bottom" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      </>
    </div>
  );
}