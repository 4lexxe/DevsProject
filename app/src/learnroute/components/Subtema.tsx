import { Node, NodeProps, Position, Handle } from "@xyflow/react"
import { SubtemaNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<SubtemaNodeData, 'string'>;


export default function SubtopicNode({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-subtopic">
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}