import { NodeProps, NodeResizeControl, Node, Position } from '@xyflow/react';
import { ParrafoNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';
import { useState } from 'react';
type CustomComponentNode = Node<ParrafoNodeData, 'string'>;

export default function Parrafo({
  id,
  selected,
  data: {
    content = "Contenido del párrafo",
    colorText = "#000000",
    backgroundColor = "",
    fontSize = 16,
    borderColor= '#ccc',
    measured = { width: 300, height: 150 },
    fontFamily = 'Arial',
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
        border: `1px solid ${borderColor}`,
        fontFamily,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {content}
      <NodeResizeControl
        minWidth={200}
        minHeight={100}
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
