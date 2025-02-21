import { useState } from 'react';
import { NodeProps, NodeResizeControl, Node, Position } from '@xyflow/react';
import { TodoNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';
import BidirectionalHandle from './BidirectionalHandle';

type CustomComponentNode = Node<TodoNodeData>;

export default function ToDo({
  id,
  selected,
  data: {
    label = "Tarea pendiente",
    colorText = "#000000",
    backgroundColor = "#ffffff",
    fontSize = 16,
    measured = { width: 300, height: 60 },
  },
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);
  const [checked, setChecked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: colorText,
        backgroundColor,
        fontSize: `${fontSize}px`,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        padding: '10px',
        border: '1px solid #ccc',
        position: 'relative',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        style={{ marginRight: '10px' }}
      />
      <span style={{ textDecoration: checked ? 'line-through' : 'none' }}>
        {label}
      </span>
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
