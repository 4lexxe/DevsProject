import { useCallback } from "react";
import {
    ReactFlow,
    MiniMap, 
    Controls, 
    Background, 
    addEdge, 
    type Connection,
    BackgroundVariant,
    useEdgesState,
    useNodesState,
    Node,
    Panel
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { initialNodes } from '../constants/InitialNodes.constants';
import { initialEdges } from '../constants/InitialEdges.constants';
import {COMPONENTS} from '../constants/components.constants'
import NodeButton  from '../components/NodeButton';
import { Button } from "./Button";

const nodeTypes = {
  nodeButton: NodeButton
}

const RoadmapEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Manejar la conexión de nodos
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

   // Función para agregar un nuevo nodo
   const addNode = () => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
      type: "default",
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="w-full h-screen border border-gray-300 relative overflow-auto">
      <button onClick={addNode} 
        className="absolute z-10 top-2 left-2 bg-blue-500 text-white p-2 rounded">
        Add Node
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        
      >
        <Panel
  position="top-left"
  className="flex h-[calc(100vh-61px)] w-64 shrink-0 flex-col overflow-y-auto p-5 rounded-lg bg-white border shadow"
>
  <p className="text-sm font-semibold text-gray-700 mb-3">
    COMPONENTS <span className="text-gray-400 text-xs">(DRAG & DROP)</span>
  </p>
  
  <div className="flex flex-col gap-2">
    {COMPONENTS.map((component) => (
      <Button
        key={component.label}
        variant="ghost"
        size="icon"
        className="flex items-center justify-start gap-4 w-full py-3 px-4 border rounded-lg shadow-sm bg-white text-lg font-medium text-gray-800 hover:bg-gray-100"
      >
        {component.icon}
        <span>{component.label}</span>
      </Button>
    ))}
  </div>
</Panel>

        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
      </ReactFlow>
    </div>
  );
};

export default RoadmapEditor;