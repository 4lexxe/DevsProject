import { useEffect, useState, useRef } from 'react'; // Añade useRef
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Función para descargar el roadmap como PDF
  const downloadRoadmapAsPDF = async () => {
    const roadmapContainer = document.querySelector('.roadmap-container') as HTMLElement;
    if (!roadmapContainer) {
      toast.error('No se pudo encontrar el contenedor del roadmap.');
      return;
    }
  
    try {
      // Ajuste más preciso de la vista
      if (reactFlowRef.current) {
        reactFlowRef.current.fitView({ padding: 0.2 }); // Reducir padding para mejor ajuste
      }
  
      // Esperar más tiempo para asegurar el ajuste visual
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      // Calcular dimensiones para el PDF
      const pdf = new jsPDF('l', 'mm', 'a4'); // Orientación horizontal (landscape)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calcular relación de aspecto del contenedor
      const containerWidth = roadmapContainer.offsetWidth;
      const containerHeight = roadmapContainer.offsetHeight;
      const scale = Math.min(
        pageWidth / containerWidth * 0.95,
        pageHeight / containerHeight * 0.95
      );
  
      // Capturar con escala dinámica
      const canvas = await html2canvas(roadmapContainer, {
        scale: scale * 10, // Mejor calidad con escala adaptativa
        useCORS: true,
        logging: true,
      });
  
      // Ajustar imagen al PDF
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${roadmap?.title || 'roadmap'}.pdf`);
      toast.success('PDF generado correctamente');
      
    } catch (err) {
      console.error('Error al generar el PDF:', err);
      toast.error('Error al generar el PDF');
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
      <div className="h-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden max-w-6xl mx-auto"> {/* Added max-w-6xl y mx-auto */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">{roadmap?.title}</h1>
          <p className="text-gray-600 mt-1">{roadmap?.description}</p>
          <button
            onClick={downloadRoadmapAsPDF}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Descargar como PDF
          </button>
        </div>
        
        {/* Contenedor del roadmap con padding lateral */}
        <div className="h-[calc(100%-5rem)] roadmap-container px-4"> {/* Added px-4 */}
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
              className={isMobile ? "scale-75" : ""}
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