import React from 'react'
import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { ParrafoNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<ParrafoNodeData, 'string'>;

export default function Parrafo({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-paragraph">
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}