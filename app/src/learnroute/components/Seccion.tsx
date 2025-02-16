import { NodeProps, NodeResizeControl, Node, useReactFlow } from '@xyflow/react';
import { SeccionNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<SeccionNodeData>;

export default function Seccion({
  id,
  data: {
    borderColor = '#9C27B0',
    backgroundColor = 'rgba(156, 39, 176, 0.1)',
    borderRadius = 12,
    measured = { width: 400, height: 300 },
  },
}: NodeProps<CustomComponentNode>) {
  // Usamos el hook para acceder a funciones globales de XYFlow
  const { setNodes } = useReactFlow();

  const handleResize = (_: any, { width, height }: { width: number; height: number }) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              measured: { width, height },
            },
            style: {
              ...node.style,
              width: `${width}px`,
              height: `${height}px`,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div
      style={{
        border: `2px dashed ${borderColor}`,
        borderRadius: `${borderRadius}px`,
        backgroundColor,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        position: 'relative',
      }}
    >
      <NodeResizeControl
        minWidth={200}
        minHeight={150}
        position="bottom-right"
        style={{ background: 'transparent', border: 'none' }}
        onResize={handleResize}
      >
        <div
          style={{
            width: '10px',
            height: '10px',
            borderRight: `2px solid ${borderColor}`,
            borderBottom: `2px solid ${borderColor}`,
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
