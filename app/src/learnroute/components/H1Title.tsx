import { useState } from "react";

import { NodeProps, NodeResizeControl, Node, Position } from '@xyflow/react';
import { TitleNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';

type CustomComponentNode = Node<TitleNodeData, 'string'>;


export default function H1Title({
  id,
  selected,
  data: {
    label = "Título",
    colorText = "#000000",
    backgroundColor = "#ffffff",
    fontSize = 24,
    layoutOrder = 0 ,
    borderRadius=8 ,
    borderColor= '#ccc',
    measured = { width: 300, height: 50 },
  },
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        color: colorText,
        backgroundColor,
        fontSize: `${fontSize}px`,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        borderRadius: `${borderRadius}px`,
        border: `1px solid ${borderColor}`,
        zIndex: layoutOrder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontWeight: 'bold'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {label}
      <NodeResizeControl
        minWidth={150}
        minHeight={40}
        position="bottom-right"
        onResize={handleResize}
        style={{ background: 'transparent', border: 'none' }}
      >
        {selected && (
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRight: '2px solid #000',
              borderBottom: '2px solid #000',
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              cursor: 'se-resize',
            }}
          />

        )}
      </NodeResizeControl>
      <BidirectionalHandle position={Position.Left} id="left" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Right} id="right" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Top} id="top" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
      <BidirectionalHandle position={Position.Bottom} id="bottom" style={isHovered ? { opacity: 1 } : { opacity: 0 } }/>
    </div>
  );
}
