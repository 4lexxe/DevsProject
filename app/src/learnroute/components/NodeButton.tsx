import React from 'react'
import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { NodeButtonData } from '../types/CustomComponentType';


type CustomComponentNode = Node<NodeButtonData, 'string'>;

function NodeButton({
    data: {
      label, 
      colorText = '#000000', 
      backgroundColor = '#facc15', 
      fontSize = 16, 
      layoutOrder = 0,
      borderRadius=8,
    },
}: NodeProps<CustomComponentNode>) {
  return (
    <div className='relative h-full'>
    <div  
      className='react-flow__nodeButton'
      style={{
        color:colorText,
        backgroundColor,
        fontSize: `${fontSize}px`,
        zIndex: layoutOrder, // Aplicar el orden del layout
        padding: '12px 20px',
        borderRadius: `${borderRadius}px`,
        border: '1px solid #ccc',
      }}>
        <span className="text-sm absolute">
            {label}
        </span>
        <Handle 
          type="source" 
          position={Position.Right} 
          id="right"
        />
        <Handle 
          type="target" 
          position={Position.Left} 
          id="left"
        />
        
        <Handle 
          type="source" 
          position={Position.Left} 
          id="left"
        />
        <Handle 
          type="target" 
          position={Position.Right} 
          id="right"
        />
    </div>

    </div>
  );
}

export default NodeButton