import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, BookOpen } from 'lucide-react';
import LearningPath from '@/course/components/LearningPath/LearningPath';
import { getCourseProgress, type CourseProgressDetails } from '@/course/services/progressService';
import Progress from '@/learnroute/components/Progress';

const CourseProgressPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [courseProgress, setCourseProgress] = useState<CourseProgressDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const progressData = await getCourseProgress(courseId);
        setCourseProgress(progressData);
      } catch (err) {
        setError('Error al cargar el progreso del curso');
        console.error('Error fetching course progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando progreso del curso...</p>
        </div>
      </div>
    );
  }

  if (error || !courseProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Error al cargar el progreso'}</p>
          <button 
            onClick={() => window.history.back()}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header del curso */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-shrink-0">
              <img 
                src={courseProgress.course.image} 
                alt={courseProgress.course.title}
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg object-cover"
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                {courseProgress.course.title}
              </h1>
              <p className="text-gray-600 mb-4">
                {courseProgress.course.summary}
              </p>
              
              {/* Estadísticas de progreso */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progreso General</p>
                      <p className="text-xl font-bold text-blue-600">
                        {courseProgress.progress.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contenido Completado</p>
                      <p className="text-xl font-bold text-green-600">
                        {courseProgress.progress.completedContent}/{courseProgress.progress.totalContent}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tiempo Total</p>
                      <p className="text-xl font-bold text-purple-600">
                        {Math.round(courseProgress.progress.totalTimeSpent / 60)}h
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Barra de progreso general */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progreso del curso</span>
                  <span className="text-sm text-gray-500">{courseProgress.progress.percentage}%</span>
                </div>
                <Progress 
                  progress={courseProgress.progress.percentage} 
                  color="blue" 
                  className="h-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido del curso con progreso */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LearningPath courseId={parseInt(courseId!)} />
      </div>
    </div>
  );
};

export default CourseProgressPage;