// LearnRoute.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { RoadmapService, Roadmap } from '../services/RoadMap.service';
import { Map, Users, Clock, ArrowUpRight, Loader2, Trash, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PreviewRoadmap from '../components/PreviewRoadmap';
import ProtectedComponent from "../components/ProtectComponent";
import { Plus } from 'react-feather';

const LearnRoute = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: roadmaps, isLoading, error } = useQuery<Roadmap[]>({
    queryKey: ['roadmaps'],
    queryFn: RoadmapService.getAll,
    retry: 3,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => RoadmapService.delete(id),
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
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-[#8E9196] mb-4">No se pudo cargar los roadmaps</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#F3F4F6] hover:bg-gray-200 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-12 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Sección del botón flotante */}
        <ProtectedComponent>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <button
              // El handler es simple y no utiliza funciones peligrosas
              onClick={() => navigate('/editor-roadmap')}
              className="flex items-center gap-2 px-6 py-3 bg-[#3a383d] text-white rounded-lg shadow-lg hover:bg-[#2A292D] transition-all duration-300 hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Crear Roadmap
            </button>
          </motion.div>
        </ProtectedComponent>

        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 text-sm bg-[#F3F4F6] text-[#403E43] rounded-full mb-4">
              Rutas de Aprendizaje
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1F2C] mb-4">
              Roadmaps Educativos
            </h1>
            <p className="text-[#8E9196] max-w-2xl mx-auto text-lg">
              Navegue su viaje de aprendizaje con rutas educativas seleccionadas por expertos
            </p>
          </motion.div>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-[#8E9196]" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmaps?.map((roadmap, index) => (
              <motion.div
                key={roadmap.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
              >

                <div className="absolute top-6 right-6">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${roadmap.isPublic
                      ? 'bg-[#F1F0FB] text-[#403E43]'
                      : 'bg-[#F1F0FB] text-[#403E43]'
                      }`}
                  >
                    {roadmap.isPublic ? 'Publico' : 'Privado'}
                  </span>
                </div>
                <div className="flex items-center mb-6">
                  <Map className="w-5 h-5 text-[#403E43] mr-3" />
                  <h3 className="text-xl font-medium text-[#1A1F2C] group-hover:text-[#403E43] transition-colors">
                    {roadmap.title}
                  </h3>
                </div>
                <p className="text-[#8E9196] mb-8 line-clamp-2 leading-relaxed">
                  {roadmap.description}
                </p>
                <div className="mb-6">
                  <PreviewRoadmap structure={roadmap.structure || { nodes: [], edges: [] }} />
                </div>
                <div className="flex justify-between items-center mt-auto border-t pt-6 border-[#F1F0FB]">
                  <div className="flex items-center text-sm text-[#8E9196]">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{roadmap.User?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center text-sm text-[#8E9196]">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {/* Nueva sección de botones con mejor diseño */}
                <div className="absolute top-[78.5%] right-8 flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ProtectedComponent>

                    <button
                      onClick={() => {
                        if (window.confirm('¿Estás seguro de eliminar este roadmap?')) {
                          deleteMutation.mutate(roadmap.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white border border-red-200 text-red-500 hover:bg-red-50 transition-all duration-300 shadow-sm hover:shadow backdrop-blur-sm"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </ProtectedComponent>

                  <ProtectedComponent>

                    <button
                      onClick={() => navigate(`/editor-roadmap/${roadmap.id}`)}
                      className="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow backdrop-blur-sm"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </ProtectedComponent>
                  <button
                    onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
                    className="p-2 rounded-lg bg-[#3a383d] text-white hover:bg-[#2A292D] transition-all duration-300 shadow-sm hover:shadow"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnRoute;