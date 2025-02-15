import React from 'react'
import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { TodoNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<TodoNodeData, 'string'>;

export default function ToDo({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-todo">
      <div className='flex items-center'>
        <input id="default-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
        <div>{label}</div>
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}