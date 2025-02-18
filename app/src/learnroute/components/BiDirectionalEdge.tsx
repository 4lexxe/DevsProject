import {
    getBezierPath,
    BaseEdge,
    type EdgeProps,
  } from '@xyflow/react';
  
  export default function BiDirectionalEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  }: EdgeProps) {
    /*const hasReverseEdge = useStore((s: ReactFlowState) => {
      return s.edges.some(
        edge => edge.source === target && edge.target === source
      );
    });*/
  
    const [path] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
    });
  
    /*const edgeStyle = {
      stroke: hasReverseEdge ? '#ff0072' : '#636363',
      strokeWidth: 2,
    };*/
  
    return <BaseEdge path={path}  style={{strokeWidth: 2}} />;
  }