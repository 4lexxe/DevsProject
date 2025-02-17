import { NodeProps, NodeResizeControl, Node, Handle, Position } from '@xyflow/react';
import { ParrafoNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';

type CustomComponentNode = Node<ParrafoNodeData, 'string'>;

export default function Parrafo({
  id,
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
    >
      {content}
      <NodeResizeControl
        minWidth={200}
        minHeight={100}
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
