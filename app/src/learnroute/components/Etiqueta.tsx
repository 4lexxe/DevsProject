import { NodeProps, NodeResizeControl, Node } from '@xyflow/react';
import { EtiquetaNodeData } from '../types/CustomComponentType';
import { useNodeResize } from '../hooks/useNodeResize';

type CustomComponentNode = Node<EtiquetaNodeData, 'string'>;


export default function Etiqueta({
  id,
  data: {
    label = "Etiqueta",
    colorText = "#000000",
    backgroundColor = "#f5f5f5",
    borderColor = "#ccc",
    borderRadius = 4,
    fontSize = 14,
    layoutOrder = 0,
    measured = { width: 200, height: 40 },
  },
}: NodeProps<CustomComponentNode>) {
  const { handleResize } = useNodeResize(id);

  return (
    <div
      style={{
        color: colorText,
        backgroundColor,
        fontSize: `${fontSize}px`,
        border: `1px solid ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: layoutOrder,
      }}
    >
      {label}
      <NodeResizeControl
        minWidth={100}
        minHeight={30}
        position="bottom-right"
        onResize={handleResize}
        style={{ background: 'transparent', border: 'none' }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRight: '2px solid #000',
            borderBottom: '2px solid #000',
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            cursor: 'se-resize',
          }}
        />
      </NodeResizeControl>
    </div>
  );
}
