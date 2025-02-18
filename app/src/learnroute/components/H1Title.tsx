import { NodeProps, NodeResizeControl, Node, Handle, Position } from '@xyflow/react';
import { TitleNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';

type CustomComponentNode = Node<TitleNodeData, 'string'>;


export default function H1Title({
  id,
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
    >
      {label}
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
