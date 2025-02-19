import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ReactFlow,
  Background,
  Controls,
  BackgroundVariant,
  ConnectionMode,
  ReactFlowInstance,
} from '@xyflow/react';
import { Loader2, Clipboard } from 'lucide-react';
import { toast } from 'sonner';
import { RoadmapService } from '../services/RoadMap.service';
import BiDirectionalEdge from '../components/BiDirectionalEdge';
import NodeButton from '../components/NodeButton';
import H1Title from '../components/H1Title';
import Tema from '../components/Tema';
import Subtema from '../components/Subtema';
import Parrafo from '../components/Parrafo';
import ToDo from '../components/ToDo';
import Link from '../components/Link';
import Seccion from '../components/Seccion';
import Etiqueta from '../components/Etiqueta';
import Linea from '../components/Linea';

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

const edgeTypes = {
  bidirectional: BiDirectionalEdge,
};

const RoadMap = () => {
  const { id } = useParams<{ id: string }>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { data: roadmap, isLoading, error } = useQuery({
    queryKey: ['roadmap', id],
    queryFn: () => RoadmapService.getById(Number(id)),
    enabled: !!id,
  });

  // Referencia al componente ReactFlow
  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  // Estado para controlar el estado "copiado" del botón
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para copiar la URL actual al portapapeles y activar la animación
  const shareUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('URL copiada al portapapeles');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error al copiar la URL:', err);
      toast.error('Error al copiar la URL');
    }
  };

  if (error) {
    toast.error('Error al cargar el roadmap');
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error al cargar el roadmap</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full p-4 bg-[#FAFAFA]">
      {/* Contenedor principal ajustado */}
      <div className="h-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden max-w-6xl mx-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{roadmap?.title}</h1>
            <p className="text-gray-600 mt-1">{roadmap?.description}</p>
          </div>
          <button
            onClick={shareUrl}
            className={`mt-4 px-4 py-2 rounded-md border transition-all duration-2000 
              ${copied 
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'
              }`}
          >
            {copied ? (
              <span className="flex items-center">
                ¡Copiado! <Clipboard className="ml-2" size={16} />
              </span>
            ) : (
              'Compartir'
            )}
          </button>
        </div>

        {/* Contenedor del roadmap con padding lateral */}
        <div className="h-[calc(100%-5rem)] roadmap-container px-4">
          <ReactFlow
            onInit={(instance) => (reactFlowRef.current = instance)}
            nodes={roadmap?.structure.nodes || []}
            edges={roadmap?.structure.edges || []}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            connectionMode={ConnectionMode.Loose}
            fitView
            minZoom={0.1}
            maxZoom={1.5}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            style={{ width: '100%', height: '100%' }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={12}
              size={1}
              color="#e0e0e0"
            />
            <Controls
              className={isMobile ? 'scale-75' : ''}
              showZoom={!isMobile}
              showFitView={!isMobile}
            />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default RoadMap;
