// src/components/BidirectionalHandle.tsx
import { Handle, Position } from '@xyflow/react';
import React from 'react';

interface BidirectionalHandleProps {
  position: Position;
  id: string;
  style?: React.CSSProperties;
}

const BidirectionalHandle: React.FC<BidirectionalHandleProps> = ({ position, id, style }) => {
  return (
    <>
      <Handle
        type="source"
        position={position}
        id={id} // Usa el ID directamente
        style={style}
      />
      <Handle
        type="target"
        position={position}
        id={id} // Usa el ID directamente
        style={style}
      />
    </>
  );
};

export default BidirectionalHandle;