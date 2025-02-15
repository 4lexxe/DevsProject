import React from 'react'
import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { TemaNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<TemaNodeData, 'string'>;

export default function TopicNode({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-topic">
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}