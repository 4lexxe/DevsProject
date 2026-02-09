import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import api from '@/shared/api/axios';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data.data || response.data);
      } catch (error) {
        console.error('Error al cargar el curso:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourse();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!course) return <div>Curso no encontrado</div>;

  const getCreatorDisplayName = () => {
    if (!course.creator) return 'Instructor desconocido';
    return course.creator.displayName || course.creator.name || course.creator.username || 'Instructor';
  };

  const getCreatorAvatar = () => {
    if (course.creator?.avatar) return course.creator.avatar;
    const name = getCreatorDisplayName();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-gray-600 mb-6">{course.description}</p>
          {/* ...existing content... */}
        </div>

        {/* Sidebar - Información del instructor */}
        <div className="lg:col-span-1">
          {course.creator && (
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">Instructor</h3>
              <div className="flex items-start gap-4">
                <img
                  src={getCreatorAvatar()}
                  alt={getCreatorDisplayName()}
                  className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {getCreatorDisplayName()}
                  </h4>
                  {course.creator.username && (
                    <p className="text-sm text-gray-500 mb-2">
                      @{course.creator.username}
                    </p>
                  )}
                  <button className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                    <User className="w-4 h-4 mr-1" />
                    Ver perfil
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
