import { Handle, Position, Node, NodeProps } from '@xyflow/react';
import { TitleNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<TitleNodeData, 'string'>;

export default function TitleNode({
    data: {label},
}: NodeProps<CustomComponentNode>) {
  return (
    <div className="react-flow__node-title">
      <Handle type="source" position={Position.Bottom} />
      <div className="font-bold">{label}</div>
    </div>
  );
}