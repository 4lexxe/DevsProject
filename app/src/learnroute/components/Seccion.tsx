import React from 'react'
import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { SeccionNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<SeccionNodeData, 'string'>;

export default function Parrafo({
    data: {},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-seccion">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}