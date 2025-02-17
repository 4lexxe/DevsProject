import { useState } from 'react';
import { NodeProps, NodeResizeControl, Node, Handle, Position } from '@xyflow/react';
import { TodoNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';

type CustomComponentNode = Node<TodoNodeData>;

export default function ToDo({
  id,
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
      </NodeResizeControl>
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
  );
}
