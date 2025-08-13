import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/BidirectionalHandle.tsx
import { Handle } from '@xyflow/react';
const BidirectionalHandle = ({ position, id, style }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Handle, { type: "source", position: position, id: id, style: style }), _jsx(Handle, { type: "target", position: position, id: id, style: style })] }));
};
export default BidirectionalHandle;
