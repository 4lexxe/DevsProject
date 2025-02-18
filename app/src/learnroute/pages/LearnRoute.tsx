import { useQuery } from '@tanstack/react-query';
import { RoadmapService, Roadmap } from '../services/RoadMapService';
import { Map, Users, Clock, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import PreviewRoadmap from '../components/PreviewRoadmap';

const LearnRoute = () => {
  const { data: roadmaps, isLoading, error } = useQuery<Roadmap[]>({
    queryKey: ['roadmaps'],
    queryFn: RoadmapService.getAll,
    retry: 3,
  });

  if (error) {
    toast.error('Failed to load roadmaps. Please try again later.');
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-lg text-[#8E9196] mb-4">Unable to load roadmaps</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#F3F4F6] hover:bg-gray-200 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] px-6 py-12 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 text-sm bg-[#F3F4F6] text-[#403E43] rounded-full mb-4">
              Learning Paths
            </span>
            <h1 className="text-3xl md:text-4xl font-semibold text-[#1A1F2C] mb-4">
              Educational Roadmaps
            </h1>
            <p className="text-[#8E9196] max-w-2xl mx-auto text-lg">
              Navigate your learning journey with expert-curated educational paths
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
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      roadmap.isPublic
                        ? 'bg-[#F1F0FB] text-[#403E43]'
                        : 'bg-[#F1F0FB] text-[#403E43]'
                    }`}
                  >
                    {roadmap.isPublic ? 'Public' : 'Private'}
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
                {/* Preview del roadmap */}
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
                <button
                  className="absolute bottom-8 right-8 p-2.5 rounded-full bg-[#F1F0FB] text-[#403E43] opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#403E43] hover:text-white"
                  onClick={() => {
                    /* Handle navigation */
                  }}
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnRoute;