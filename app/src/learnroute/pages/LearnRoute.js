import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// LearnRoute.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoadmapService } from '../services/RoadMap.service';
import { Map, Users, Clock, ArrowUpRight, Loader2, Trash, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PreviewRoadmap from '../components/PreviewRoadmap';
import ProtectedComponent from "../components/ProtectComponent";
import { Plus } from 'react-feather';
const LearnRoute = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: roadmaps, isLoading, error } = useQuery({
        queryKey: ['roadmaps'],
        queryFn: RoadmapService.getAll,
        retry: 3,
    });
    const deleteMutation = useMutation({
        mutationFn: (id) => RoadmapService.delete(id),
        onSuccess: () => {
            toast.success('Roadmap eliminado');
            queryClient.invalidateQueries({ queryKey: ['roadmaps'] });
        },
        onError: () => {
            toast.error('Error al eliminar el roadmap');
        }
    });
    if (error) {
        toast.error('Error al cargar los roadmaps. Porfavor intentalo de nuevo.');
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center p-4", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg text-[#8E9196] mb-4", children: "No se pudo cargar los roadmaps" }), _jsx("button", { onClick: () => window.location.reload(), className: "px-4 py-2 bg-[#F3F4F6] hover:bg-gray-200 rounded-lg transition-colors", children: "Intentar de nuevo" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-[#FAFAFA] px-6 py-12 md:px-8 lg:px-12", children: _jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx(ProtectedComponent, { children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, className: "fixed bottom-8 right-8 z-50", children: _jsxs("button", { 
                            // El handler es simple y no utiliza funciones peligrosas
                            onClick: () => navigate('/editor-roadmap'), className: "flex items-center gap-2 px-6 py-3 bg-[#3a383d] text-white rounded-lg shadow-lg hover:bg-[#2A292D] transition-all duration-300 hover:shadow-xl", children: [_jsx(Plus, { className: "w-5 h-5" }), "Crear Roadmap"] }) }) }), _jsx("div", { className: "text-center mb-16", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, children: [_jsx("span", { className: "inline-block px-4 py-1.5 text-sm bg-[#F3F4F6] text-[#403E43] rounded-full mb-4", children: "Rutas de Aprendizaje" }), _jsx("h1", { className: "text-3xl md:text-4xl font-semibold text-[#1A1F2C] mb-4", children: "Roadmaps Educativos" }), _jsx("p", { className: "text-[#8E9196] max-w-2xl mx-auto text-lg", children: "Navegue su viaje de aprendizaje con rutas educativas seleccionadas por expertos" })] }) }), isLoading ? (_jsx("div", { className: "flex justify-center items-center min-h-[400px]", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-[#8E9196]" }) })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: roadmaps?.map((roadmap, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay: index * 0.1 }, className: "group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300", children: [_jsx("div", { className: "absolute top-6 right-6", children: _jsx("span", { className: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roadmap.isPublic
                                        ? 'bg-[#F1F0FB] text-[#403E43]'
                                        : 'bg-[#F1F0FB] text-[#403E43]'}`, children: roadmap.isPublic ? 'Publico' : 'Privado' }) }), _jsxs("div", { className: "flex items-center mb-6", children: [_jsx(Map, { className: "w-5 h-5 text-[#403E43] mr-3" }), _jsx("h3", { className: "text-xl font-medium text-[#1A1F2C] group-hover:text-[#403E43] transition-colors", children: roadmap.title })] }), _jsx("p", { className: "text-[#8E9196] mb-8 line-clamp-2 leading-relaxed", children: roadmap.description }), _jsx("div", { className: "mb-6", children: _jsx(PreviewRoadmap, { structure: roadmap.structure || { nodes: [], edges: [] } }) }), _jsxs("div", { className: "flex justify-between items-center mt-auto border-t pt-6 border-[#F1F0FB]", children: [_jsxs("div", { className: "flex items-center text-sm text-[#8E9196]", children: [_jsx(Users, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: roadmap.User?.name || 'Anonymous' })] }), _jsxs("div", { className: "flex items-center text-sm text-[#8E9196]", children: [_jsx(Clock, { className: "w-4 h-4 mr-2" }), _jsx("span", { children: new Date(roadmap.createdAt).toLocaleDateString() })] })] }), _jsxs("div", { className: "absolute top-[78.5%] right-8 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300", children: [_jsx(ProtectedComponent, { children: _jsx("button", { onClick: () => {
                                                if (window.confirm('¿Estás seguro de eliminar este roadmap?')) {
                                                    deleteMutation.mutate(roadmap.id);
                                                }
                                            }, className: "p-2 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-all duration-300 shadow-sm hover:shadow backdrop-blur-sm", children: _jsx(Trash, { className: "w-4 h-4" }) }) }), _jsx(ProtectedComponent, { children: _jsx("button", { onClick: () => navigate(`/editor-roadmap/${roadmap.id}`), className: "p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow backdrop-blur-sm", children: _jsx(Edit2, { className: "w-4 h-4" }) }) }), _jsx("button", { onClick: () => navigate(`/roadmaps/${roadmap.id}`), className: "p-2 rounded-lg bg-[#3a383d] text-white hover:bg-[#2A292D] transition-all duration-300 shadow-sm hover:shadow", children: _jsx(ArrowUpRight, { className: "w-4 h-4" }) })] })] }, roadmap.id))) }))] }) }));
};
export default LearnRoute;
