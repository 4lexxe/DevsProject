import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, CheckSquare, Square, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getCourseProgress, markContentCompleted, type CourseProgressDetails } from '@/course/services/progressService';
import { toast } from 'react-hot-toast';

interface LearningPathProps {
  courseId: number;
}

const LearningPath: React.FC<LearningPathProps> = ({ courseId }) => {
  const [courseProgress, setCourseProgress] = useState<CourseProgressDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const progressData = await getCourseProgress(courseId);
        setCourseProgress(progressData);
      } catch (error) {
        console.error('Error al cargar progreso:', error);
        toast.error('Error al cargar el progreso del curso');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(current =>
      current.includes(sectionId)
        ? current.filter(id => id !== sectionId)
        : [...current, sectionId]
    );
  };

  const handleContentClick = (contentId: number) => {
    navigate(`/course/${courseId}/section/content/${contentId}`);
  };

  const toggleCompletion = async (contentId: number, isCompleted: boolean) => {
    if (isCompleted) {
      toast.info('Este contenido ya está completado');
      return;
    }

    try {
      await markContentCompleted(courseId, contentId);
      toast.success('Contenido marcado como completado');
      
      // Refrescar el progreso
      const updatedProgress = await getCourseProgress(courseId);
      setCourseProgress(updatedProgress);
    } catch (error) {
      console.error('Error al marcar como completado:', error);
      toast.error('Error al marcar como completado');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-300 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseProgress) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">No se pudo cargar el progreso del curso</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Contenido del Curso
            </h2>
            <span className="text-sm font-medium text-gray-500">
              {courseProgress.progress.completedContent} de {courseProgress.progress.totalContent} completados
            </span>
          </div>
          
          {/* Barra de progreso general */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
              style={{ width: `${courseProgress.progress.percentage}%` }}
            ></div>
          </div>
          
          <p className="text-gray-600">
            Progreso general: {courseProgress.progress.percentage}%
          </p>
        </div>

        <div className="space-y-6">
          {courseProgress.sections.map((section) => {
            const isExpanded = expandedSections.includes(section.id.toString());
            const sectionCompleted = section.progress === 100;

            return (
              <div
                key={section.id}
                className={`border rounded-lg transition-colors ${
                  sectionCompleted ? "bg-green-50/50 border-green-100" : "bg-white"
                }`}
              >
                <div 
                  className="flex items-center p-4 cursor-pointer" 
                  onClick={() => toggleSection(section.id.toString())}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-lg">{section.title}</h3>
                      <span className="text-sm text-gray-500">
                        {section.completedContent}/{section.totalContent} completados
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {section.moduleType}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${section.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{section.progress}%</span>
                    </div>
                  </div>
                  <button className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </div>
                
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="pl-4 space-y-3">
                      {section.contents.map((content) => {
                        return (
                          <div
                            key={content.id}
                            className={`flex items-center p-3 rounded-lg border transition-colors ${
                              content.isCompleted 
                                ? "bg-green-50 border-green-200" 
                                : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <button
                              className="h-6 w-6 mr-3 flex items-center justify-center"
                              onClick={() => toggleCompletion(content.id, content.isCompleted)}
                            >
                              {content.isCompleted ? (
                                <CheckSquare className="h-4 w-4 text-green-600" />
                              ) : (
                                <Square className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                            
                            <div 
                              className="flex-1 cursor-pointer" 
                              onClick={() => handleContentClick(content.id)}
                            >
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">{content.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{content.duration} min</span>
                                  {content.timeSpent > 0 && (
                                    <span>• {content.timeSpent} min gastados</span>
                                  )}
                                </div>
                              </div>
                              {content.completedAt && (
                                <p className="text-xs text-green-600 mt-1">
                                  Completado el {new Date(content.completedAt).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningPath;