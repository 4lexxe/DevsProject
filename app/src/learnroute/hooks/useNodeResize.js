import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
export function useNodeResize(nodeId) {
    const { setNodes } = useReactFlow();
    const handleResize = useCallback((_, { width, height }) => {
        setNodes((nds) => nds.map((node) => {
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
        }));
    }, [nodeId, setNodes]);
    return { handleResize };
}
