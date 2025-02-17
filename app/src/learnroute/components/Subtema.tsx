import { NodeProps, Position, Handle, NodeResizeControl, Node } from '@xyflow/react';
import { SubtemaNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';

type CustomComponentNode = Node<SubtemaNodeData, 'string'>;


// Subtema.tsx
export default function Subtema({
  id,
  data: {
    label = '',
    colorText = '#2d3436',
    backgroundColor = '#f5f6fa',
    fontSize = 14,
    layoutOrder = 0,
    borderRadius = 6,
    borderColor = '#a4b0be',
    measured = { width: 200, height: 100 },
  }
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);
  
  return (
    <div
      style={{
        color: colorText,
        fontSize: `${fontSize}px`,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        border: `2px dashed ${borderColor}`,  // Borde discontinuo
        position: 'relative',
        zIndex: layoutOrder,
        fontStyle: 'italic',  // Texto en cursiva
        padding: '8px 12px',  // Padding diferente
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <NodeResizeControl
        minWidth={120}
        minHeight={40}
        position="bottom-right"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'se-resize',
        }}
        onResize={handleResize}
      >
        <div style={{
          width: '12px',
          height: '12px',
          border: `2px solid ${borderColor}`,  // Cuadrado completo
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          background: '#fff',
          borderRadius: '2px',
          cursor: 'se-resize'
        }} />
      </NodeResizeControl>

      <div style={{ padding: '4px 0' }}>{label}</div>
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