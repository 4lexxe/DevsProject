import React from 'react'
import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { LinkNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<LinkNodeData, 'string'>;

export default function Link({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-link">
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}