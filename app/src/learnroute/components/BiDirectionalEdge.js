import { jsx as _jsx } from "react/jsx-runtime";
import { getBezierPath, BaseEdge, } from '@xyflow/react';
export default function BiDirectionalEdge({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, }) {
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
    return _jsx(BaseEdge, { path: path, style: { strokeWidth: 2 } });
}
