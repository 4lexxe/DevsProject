import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';

export function useNodeResize(nodeId: string) {
  const { setNodes } = useReactFlow();

  const handleResize = useCallback(
    (_: any, { width, height }: { width: number; height: number }) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
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
    },
    [nodeId, setNodes]
  );

  return { handleResize };
}
