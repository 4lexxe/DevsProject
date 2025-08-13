import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ReactFlow, Background, Controls, BackgroundVariant, ConnectionMode, } from '@xyflow/react';
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
import NotFound from '@/shared/components/NotFound';
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
    const { id } = useParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { data: roadmap, isLoading, error } = useQuery({
        queryKey: ['roadmap', id],
        queryFn: () => RoadmapService.getById(Number(id)),
        enabled: !!id,
    });
    // Referencia al componente ReactFlow
    const reactFlowRef = useRef(null);
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
        }
        catch (err) {
            console.error('Error al copiar la URL:', err);
            toast.error('Error al copiar la URL');
        }
    };
    if (error) {
        toast.error('Error al cargar el roadmap');
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx(NotFound, {}) }));
    }
    if (isLoading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin" }) }));
    }
    return (_jsx("div", { className: "h-screen w-full p-4 bg-[#FAFAFA]", children: _jsxs("div", { className: "h-full rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden max-w-6xl mx-auto", children: [_jsxs("div", { className: "p-4 border-b flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-800", children: roadmap?.title }), _jsx("p", { className: "text-gray-600 mt-1", children: roadmap?.description })] }), _jsx("button", { onClick: shareUrl, className: `mt-4 px-4 py-2 rounded-md border transition-all duration-2000 
              ${copied
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'bg-white text-blue-500 border border-blue-500 hover:bg-blue-50'}`, children: copied ? (_jsxs("span", { className: "flex items-center", children: ["\u00A1Copiado! ", _jsx(Clipboard, { className: "ml-2", size: 16 })] })) : ('Compartir') })] }), _jsx("div", { className: "h-[calc(100%-5rem)] roadmap-container px-4", children: _jsxs(ReactFlow, { onInit: (instance) => (reactFlowRef.current = instance), nodes: roadmap?.structure.nodes || [], edges: roadmap?.structure.edges || [], nodeTypes: nodeTypes, edgeTypes: edgeTypes, connectionMode: ConnectionMode.Loose, fitView: true, minZoom: 0.1, maxZoom: 1.5, proOptions: { hideAttribution: true }, nodesDraggable: false, nodesConnectable: false, elementsSelectable: false, style: { width: '100%', height: '100%' }, children: [_jsx(Background, { variant: BackgroundVariant.Dots, gap: 12, size: 1, color: "#e0e0e0" }), _jsx(Controls, { className: isMobile ? 'scale-75' : '', showZoom: !isMobile, showFitView: !isMobile })] }) })] }) }));
};
export default RoadMap;
