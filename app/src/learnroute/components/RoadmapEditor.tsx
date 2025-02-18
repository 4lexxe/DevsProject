import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  addEdge,
  Connection,
  BackgroundVariant,
  useEdgesState,
  useNodesState,
  Node,
  ReactFlowProvider,
  ConnectionMode,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { initialNodes } from "../constants/InitialNodes.constants";
import { initialEdges } from "../constants/InitialEdges.constants";
import { COMPONENTS } from "../constants/components.constants";
import { NodeInfoPanel } from "../components/NodePanelProperties";
import BiDirectionalEdge from "../components/BiDirectionalEdge";
import type { BidirectionalEdge } from "../types/CustomComponentType";

// Importar componentes de nodos
import NodeButton from "../components/NodeButton";
import H1Title from "../components/H1Title";
import Tema from "../components/Tema";
import Subtema from "../components/Subtema";
import Parrafo from "../components/Parrafo";
import ToDo from "../components/ToDo";
import Link from "../components/Link";
import Seccion from "../components/Seccion";
import Etiqueta from "../components/Etiqueta";

// Esquema de validación
const saveRoadmapSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type SaveRoadmapForm = z.infer<typeof saveRoadmapSchema>;

const edgeTypes = {
  bidirectional: BiDirectionalEdge,
};

const nodeTypes = {
  nodeButton: NodeButton,
  h1: H1Title,
  tema: Tema,
  subtema: Subtema,
  parrafo: Parrafo,
  todo: ToDo,
  etiqueta: Etiqueta,
  link: Link,
  seccion: Seccion,
};

const RoadmapEditor = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SaveRoadmapForm>({
    resolver: zodResolver(saveRoadmapSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => {
        const newEdge = {
          ...params,
          id: `${params.source}-${params.target}-${Date.now()}`,
          type: "bidirectional",
          markerEnd: { type: MarkerType.ArrowClosed },
        };
        return addEdge(newEdge as BidirectionalEdge, eds);
      });
    },
    [setEdges]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
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
    [setNodes]
  );

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, clickedNode: Node) => {
      const currentNode = nodes.find((n) => n.id === clickedNode.id);
      setSelectedNode(currentNode || null);
    },
    [nodes]
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, updatedNode: Partial<Node>) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...updatedNode.data,
              },
              position: updatedNode.position || node.position,
              style: {
                ...node.style,
                ...updatedNode.style,
              },
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const onSaveRoadmap = async (formData: SaveRoadmapForm) => {
    try {
      const roadmapData = {
        ...formData,
        nodes,
        edges,
      };

      // TODO: Implementar llamada API
      console.log("Datos del roadmap:", roadmapData);
    } catch (error) {
      console.error("Error al guardar el roadmap:", error);
    }
  };

  const handleExport = () => {
    const data = { nodes, edges };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "roadmap.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      } catch (error) {
        console.error("Error al leer el JSON", error);
      }
    };
    reader.readAsText(file);
  };

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Actualizar el nodo seleccionado si cambia en el estado
  useEffect(() => {
    if (selectedNode) {
      const updatedNode = nodes.find((node) => node.id === selectedNode.id);
      if (updatedNode) {
        setSelectedNode(updatedNode);
      }
    }
  }, [nodes, selectedNode]);

  // Función para alternar panel
  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen border border-gray-300 relative overflow-auto">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onNodeClick={handleNodeClick}
          edgeTypes={edgeTypes}
          connectionMode={ConnectionMode.Loose}
          nodeTypes={nodeTypes}
        >
          {/* Panel principal desplegable */}
          <div
            className={`
            fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
            ${isPanelOpen ? "translate-x-0" : "-translate-x-full"}
            ${isMobile ? "w-full" : "w-64"}
          `}
          >
            {/* Botón toggle */}
            <button
              onClick={togglePanel}
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-r-lg border border-l-0 shadow-md"
            >
              {isPanelOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>

            {/* Panel de componentes */}
            <div
              className={`
              bg-white border shadow h-full overflow-y-auto transition-all duration-300
              ${isPanelOpen ? "opacity-100" : "opacity-0"}
              ${isMobile ? "w-full p-4" : "w-64 p-5"}
            `}
            >
              {/* Título */}
              <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
                COMPONENTES
                <span className="text-gray-400 text-xs">(DRAG & DROP)</span>
              </p>

              {/* Lista de componentes */}
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

              {/* Formulario */}
              <form
                onSubmit={handleSubmit(onSaveRoadmap)}
                className="mt-4 space-y-3"
              >
                <div>
                  <input
                    {...register("title")}
                    placeholder="Título del roadmap"
                    className="w-full p-2 border rounded"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-xs">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <textarea
                  {...register("description")}
                  placeholder="Descripción (opcional)"
                  className="w-full p-2 border rounded"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isPublic")}
                    id="isPublic"
                  />
                  <label htmlFor="isPublic" className="text-sm">
                    Público
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Guardar Roadmap
                </button>
              </form>

              {/* Botones de importar/exportar */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleExport}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Exportar Roadmap
                </button>
                <label
                  htmlFor="import-json"
                  className="p-2 bg-blue-500 text-white rounded cursor-pointer text-center hover:bg-blue-600"
                >
                  Importar Roadmap
                </label>
                <input
                  id="import-json"
                  type="file"
                  accept="application/json"
                  onChange={handleImport}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Controles responsivos */}
          <div
            className={`
            fixed bottom-4 right-4 flex flex-col gap-2 z-50
            ${isMobile ? "scale-75 origin-bottom-right" : ""}
          `}
          >
            <MiniMap className={isMobile ? "hidden" : ""} />
            <Controls
              className={isMobile ? "flex-row" : "flex-col"}
              showZoom={!isMobile}
              showFitView={!isMobile}
            />
          </div>

          <Background
            variant={BackgroundVariant.Dots}
            gap={isMobile ? 8 : 12}
            size={1}
          />
        </ReactFlow>

        {/* Panel de edición de nodos */}
        <NodeInfoPanel
          isOpen={!!selectedNode}
          onClose={() => setSelectedNode(null)}
          node={selectedNode}
          onUpdateNode={handleUpdateNode}
        />
      </div>
    </ReactFlowProvider>
  );
};

export default RoadmapEditor;
