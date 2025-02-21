import { Edge, MarkerType} from "@xyflow/react";

  export const initialEdges: Edge[] = [
    // Conexión de derecha a izquierda
    {
      id: 'edge-1-2',
      source: '1',
      target: '2',
      sourceHandle: 'right', // Handle derecho del nodo 1
      targetHandle: 'left',  // Handle izquierdo del nodo 2
      type: 'bidirectional',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
    // Conexión de izquierda a derecha
    {
      id: 'edge-2-1',
      source: '2',
      target: '1',
      sourceHandle: 'left',  // Handle izquierdo del nodo 2
      targetHandle: 'right', // Handle derecho del nodo 1
      type: 'bidirectional',
      markerEnd: { type: MarkerType.ArrowClosed },
    },
  ];