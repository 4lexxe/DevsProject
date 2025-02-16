import { NodeProps, Position, Handle, NodeResizeControl,Node } from '@xyflow/react';
import { SubtemaNodeData } from '../types/CustomComponentType';

type CustomComponentNode = Node<SubtemaNodeData, 'string'>;


export default function Subtema({
  data: {
    label='', 
    colorText = '#000000', 
    backgroundColor = '#ccccc', 
    fontSize = 16, 
    layoutOrder = 0 ,
    borderRadius=8 ,
    borderColor= '#ccc',
    measured = { width: 200, height: 100 },
  }
}: NodeProps<CustomComponentNode>) {
  return (
    <div
      style={{
        color: colorText,
        fontSize: `${fontSize}px`,
        backgroundColor,
        borderRadius: `${borderRadius}px`,
        width: `${measured.width}px`,
        height: `${measured.height}px`,
        border: `$1px solid ${borderColor}`,
        position: 'relative',
        zIndex: layoutOrder
      }}
    >
      <NodeResizeControl
        minWidth={120}
        minHeight={40}
        position="bottom-right"
        style={{ background: 'transparent', border: 'none' }}
      >
        <div style={{width: '10px',
  height: '10px',
  borderRight: '2px solid #ccc',
  borderBottom: '2px solid #ccc',
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  cursor: 'se-resize'}} />
      </NodeResizeControl>
      
      <Handle type="target" position={Position.Top} />
      <div>{label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const resizeHandleStyle = {
  width: '10px',
  height: '10px',
  borderRight: '2px solid #ccc',
  borderBottom: '2px solid #ccc',
  position: 'absolute',
  bottom: '2px',
  right: '2px',
  cursor: 'se-resize'
};