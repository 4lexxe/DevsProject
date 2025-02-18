// Importaciones de bibliotecas y componentes
import { useCallback, useContext, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Plus } from "lucide-react";
import axios from 'axios';
import { RoadmapService } from '../services/RoadMapService';
import { AuthContext, AuthContextType }  from '../../auth/contexts/AuthContext';
import toast from 'react-hot-toast';
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
  ConnectionMode,
  MarkerType,
  useReactFlow,
} from "@xyflow/react";
import { ReactFlowProvider } from '@xyflow/react';
import "@xyflow/react/dist/style.css";

// Importaciones de constantes y componentes
import { initialNodes } from "../constants/InitialNodes.constants";
import { initialEdges } from "../constants/InitialEdges.constants";
import { COMPONENTS } from "../constants/components.constants";
import { NodeInfoPanel } from "../components/NodePanelProperties";
import BiDirectionalEdge from "../components/BiDirectionalEdge";
import type { BidirectionalEdge } from "../types/CustomComponentType";

// Importación de componentes de nodos
import NodeButton from "../components/NodeButton";
import H1Title from "../components/H1Title";
import Tema from "../components/Tema";
import Subtema from "../components/Subtema";
import Parrafo from "../components/Parrafo";
import ToDo from "../components/ToDo";
import Link from "../components/Link";
import Seccion from "../components/Seccion";
import Etiqueta from "../components/Etiqueta";
import Linea from "../components/Linea"

// Esquema de validación para el formulario de guardado
const saveRoadmapSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type SaveRoadmapForm = z.infer<typeof saveRoadmapSchema>;

// Definición de tipos de bordes y nodos personalizados
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
  line: Linea,
};

const RoadmapEditorContent = () => {
  // Estados para el manejo del panel y responsive
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const { screenToFlowPosition } = useReactFlow();

  // Estados para el manejo de nodos y bordes
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // Configuración del formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<SaveRoadmapForm>({
    resolver: zodResolver(saveRoadmapSchema),
    defaultValues: {
      isPublic: true,
    },
  });

  // Función para conectar nodos
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

  // Función para agregar nodo en modo móvil
  const handleAddNode = useCallback((type: string) => {
    // Obtener el centro del viewport
    const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    
    const newNode = {
      id: crypto.randomUUID(),
      type,
      position: { x: position.x - 75, y: position.y - 25 }, // Centrar el nodo
      data: { label: `Nuevo ${type}` },
    };

    setNodes((nds) => nds.concat(newNode));
    setIsPanelOpen(false); // Cerrar el panel después de agregar
    toast.success(`${type} agregado`);
  }, [screenToFlowPosition, setNodes]);

  // Funciones para el manejo de drag & drop (solo desktop)
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    if (!isMobile) {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    }
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

      // Calcula la posición del nuevo nodo
      const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();
      const position = reactFlowBounds ? {
        x: (event.clientX - reactFlowBounds.left) / (window.innerWidth < 768 ? 0.75 : 1),
        y: (event.clientY - reactFlowBounds.top) / (window.innerWidth < 768 ? 0.75 : 1),
      } : { x: 0, y: 0 };

      const newNode = {
        id: crypto.randomUUID(),
        type,
        position,
        data: { label: `Nuevo ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  // Manejo de selección y actualización de nodos
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

  // Hook personalizado para autenticación
  const { user } = useAuth();

  // Función para guardar el roadmap con confirmación
  const handleSaveClick = () => {
    const formData = getValues();
    if (!formData.title) {
      toast.error('Por favor, ingresa un título para el roadmap');
      return;
    }
    setIsConfirmingSave(true);
  };

  const onSaveRoadmap = async (formData: SaveRoadmapForm) => {
    try {
      if (!user) {
        toast.error('Debes iniciar sesión para guardar un roadmap');
        return;
      }

      const structure = {
        nodes,
        edges
      };

      const roadmapData = {
        ...formData,
        structure
      };

      await RoadmapService.create(roadmapData);
      toast.success('¡Roadmap guardado exitosamente!');
      setIsConfirmingSave(false);

    } catch (error) {
      console.error("Error al guardar el roadmap:", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Error al guardar el roadmap';
        toast.error(message);
      } else {
        toast.error('Error al guardar el roadmap');
      }
      setIsConfirmingSave(false);
    }
  };

  // Funciones para exportar e importar
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
          toast.success('Roadmap importado correctamente');
        }
      } catch (error) {
        console.error("Error al leer el JSON", error);
        toast.error('Error al importar el roadmap');
      }
    };
    reader.readAsText(file);
  };

  // Efecto para manejar el responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768 && isPanelOpen) {
        setIsPanelOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPanelOpen]);

  // Efecto para actualizar el nodo seleccionado
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
    <div className="w-full h-screen border border-gray-300 relative overflow-hidden">
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
        className="touch-none"
      >
        {/* Panel principal desplegable */}
        <div
          className={`
            fixed top-[4rem] bottom-[4rem] z-50 transition-all duration-300 ease-in-out
            ${isPanelOpen ? "translate-x-0" : "-translate-x-full"}
            ${isMobile ? "w-full" : "w-64"}
          `}
        >
          {/* Botón toggle para desktop */}
          {!isMobile && (
            <button
              onClick={togglePanel}
              className="absolute -right-10 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-r-lg border border-l-0 shadow-md hover:bg-gray-50"
              aria-label={isPanelOpen ? "Cerrar panel" : "Abrir panel"}
            >
              {isPanelOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
          )}

          {/* Panel de componentes */}
          <div
            className={`
              bg-white border-r shadow-lg h-full overflow-y-auto transition-all duration-300
              ${isPanelOpen ? "opacity-100" : "opacity-0"}
              ${isMobile ? "w-full" : "w-64"}
            `}
          >
            {/* Cabecera del panel con título y botón de cierre en móvil */}
            <div className="sticky top-0 bg-white z-10 border-b">
              <div className="flex items-center justify-between p-4">
                <p className="text-sm font-semibold text-gray-700">
                  COMPONENTES
                  <span className="text-gray-400 text-xs ml-2">
                    {isMobile ? "(TOCA PARA AGREGAR)" : "(DRAG & DROP)"}
                  </span>
                </p>
                {isMobile && (
                  <button
                    onClick={togglePanel}
                    className="p-1 hover:bg-gray-100 rounded-full"
                    aria-label="Cerrar panel"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Grid de componentes con altura máxima */}
            <div className="p-4 max-h-[40vh] overflow-y-auto">
              <div className={`
                grid gap-2
                ${isMobile ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}
              `}>
                {COMPONENTS.map((component) => (
                  <div
                    key={component.label}
                    className={`
                      flex items-center gap-2 p-2 border rounded-md transition-colors
                      ${isMobile 
                        ? 'active:bg-blue-50 hover:bg-gray-50 cursor-pointer' 
                        : 'cursor-move hover:bg-gray-50'
                      }
                    `}
                    onClick={() => isMobile && handleAddNode(component.type)}
                    onDragStart={(event) => onDragStart(event, component.type)}
                    draggable={!isMobile}
                  >
                    {component.icon}
                    <span className="text-sm truncate flex-1">{component.label}</span>
                    {isMobile && <Plus size={16} className="text-blue-500" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="p-4 border-t">
              <form
                onSubmit={handleSubmit(onSaveRoadmap)}
                className="space-y-4"
              >
                <div>
                  <input
                    {...register("title")}
                    placeholder="Título del roadmap"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.title && (
                    <span className="text-red-500 text-xs mt-1 block">
                      {errors.title.message}
                    </span>
                  )}
                </div>

                <textarea
                  {...register("description")}
                  placeholder="Descripción (opcional)"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("isPublic")}
                    id="isPublic"
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Hacer público
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Guardar Roadmap
                </button>
              </form>

              {/* Botones de importar/exportar */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={handleExport}
                  className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                >
                  Exportar Roadmap
                </button>
                <label
                  htmlFor="import-json"
                  className="p-2 bg-blue-500 text-white rounded cursor-pointer text-center hover:bg-blue-600 transition-colors"
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
        </div>

        {/* Botón flotante para abrir panel en móvil */}
        {isMobile && !isPanelOpen && (
          <button
            onClick={togglePanel}
            className="fixed top-20 left-4 z-50 bg-white p-2 rounded-full shadow-lg border hover:bg-gray-50"
            aria-label="Abrir panel"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Controles responsivos */}
        <div
          className={`
            fixed bottom-4 right-4 flex flex-col gap-2 z-50
            ${isMobile ? "scale-75 origin-bottom-right" : ""}
          `}
        >
          <MiniMap 
            className={isMobile ? "hidden" : ""} 
            zoomable 
            pannable
          />
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

      {/* Modal de confirmación de guardado */}
      {isConfirmingSave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmar guardado</h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas guardar este roadmap?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setIsConfirmingSave(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit(onSaveRoadmap)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function RoadmapEditor() {
  return (
    <ReactFlowProvider>
      <RoadmapEditorContent />
    </ReactFlowProvider>
  );
}

function useAuth(): { user: AuthContextType['user'] } {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Error al obtener el contexto de autenticación');
  }
  return context as AuthContextType;
}