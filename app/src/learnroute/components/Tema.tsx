import React from 'react';
import { Node, NodeProps, Position, Handle } from '@xyflow/react';
import { TemaNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<TemaNodeData, 'string'>;

export default function TopicNode({
  data: { 
    label, 
    colorText = '#000000', 
    backgroundColor = '#ffffff', 
    fontSize = 16, 
    layoutOrder = 0 ,
    borderRadius=8
  },
}: NodeProps<CustomComponentNode>) {
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
        border: '1px solid #ccc',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}