import React from 'react'
import { Node, NodeProps, Position } from "@xyflow/react"
import { NodeButtonData } from '../types/CustomComponentType';
import CustomHandle from '../components/CustomHandle';


type CustomComponentNode = Node<NodeButtonData, 'string'>;

function NodeButton({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className='relative h-full'>
    <div  className='flex items-center justify-center cursor-pointer bg-yellow-400 border border-black rounded-md px-4 py-2 shadow-md w-36 h-12'>
        <span className="text-sm absolute">
            {label}
        </span>
        <CustomHandle type='source' position={Position.Top}/>
        <CustomHandle type='source' position={Position.Left}/>
        <CustomHandle type='source' position={Position.Right}/>
        <CustomHandle type='source' position={Position.Bottom}/>
    </div>

    </div>
  )
}

export default NodeButton