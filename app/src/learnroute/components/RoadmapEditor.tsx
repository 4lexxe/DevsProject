import { useCallback, useState } from "react";
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
import { COMPONENTS } from '../constants/components.constants'
import NodeButton from '../components/NodeButton';
import H1Title from "../components/H1Title"
import Tema from "../components/Tema";
import Subtema from "../components/Subtema";
import Parrafo from "../components/Parrafo";
import ToDo from "../components/ToDo";
import Link from "../components/Link";
import Seccion from "../components/Seccion";
import { CustomComponentType } from "../types/CustomComponentType";
import { NodeInfoPanel } from '../components/NodePanelProperties';


const nodeTypes = {
  nodeButton: NodeButton,
  h1: H1Title,
  tema: Tema,
  subtema: Subtema,
  parrafo: Parrafo,
  todo: ToDo,
  link: Link,
  seccion: Seccion,
}

const RoadmapEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Manejar la conexión de nodos
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 200,
        y: event.clientY - 40,
      };

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: `New ${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);
  const handleUpdateNode = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: newData,
          };
        }
        return node;
      })
    );
  }, [setNodes]);


  // Función para agregar un nuevo nodo
  const addNode = (type: CustomComponentType) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Node ${nodes.length + 1}` },
      type: type,
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
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={handleNodeClick}
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
              <div
                key={component.label}
                className="flex items-center gap-2 p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                onDragStart={(event) => onDragStart(event, component.type)}
                draggable
              >
                {component.icon}
                <span className="text-sm">{component.label}</span>
              </div>
            ))}
          </div>
        </Panel>

        <MiniMap />
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <NodeInfoPanel
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onUpdateNode={handleUpdateNode}
      />
    </div>
  );
};

export default RoadmapEditor;