import { NodeResizeControl  } from '@xyflow/react';
import { Node, NodeProps, Position, Handle } from '@xyflow/react';
import { TemaNodeData } from '../types/CustomComponentType';
import { Expand } from 'lucide-react';
import { useState, useEffect } from 'react';

type CustomComponentNode = Node<TemaNodeData, 'string'>;

const controlStyle = {
  background: 'transparent',
  border: 'none',
};

export default function TopicNode({
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
  const [dimensions, setDimensions] = useState({ width: measured.width, height: measured.height });
  useEffect(() => {
    setDimensions({ width: measured.width, height: measured.height });
  }, [measured.width, measured.height]);
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
      }}
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
        onResize={(_, { width, height }) => {
          setDimensions({ width, height });
          measured.width = width;
          measured.height = height;
        }}
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

      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
      </>
    </div>
  );
}