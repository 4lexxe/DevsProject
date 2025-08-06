import React, { useState, useEffect } from 'react';
import { getPublicContents } from '../services/contentServices';
import { toast } from 'react-hot-toast';

interface Content {
  id: number;
  title: string;
  text: string;
  markdown?: string;
  duration: number;
  position: number;
  sectionId: number;
  section?: {
    id: number;
    title: string;
    description: string;
  };
  createdAt: string;
  updatedAt: string;
}

const PublicContentsPage: React.FC = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicContents = async () => {
      try {
        setLoading(true);
        const data = await getPublicContents();
        setContents(data);
        toast.success('Contenidos públicos cargados correctamente');
      } catch (err) {
        console.error('Error al cargar contenidos públicos:', err);
        setError('Error al cargar los contenidos públicos');
        toast.error('Error al cargar los contenidos');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicContents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando contenidos públicos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📚 Contenidos Públicos
          </h1>
          <p className="text-gray-600">
            Explora nuestros contenidos educativos disponibles públicamente
          </p>
        </div>

        {contents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No hay contenidos disponibles
            </h3>
            <p className="text-gray-500">
              Aún no hay contenidos públicos para mostrar.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contents.map((content) => (
              <div
                key={content.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {content.title}
                  </h2>
                  <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full ml-2 flex-shrink-0">
                    {content.duration} min
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {content.text}
                </p>
                
                {content.section && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Sección:</span>
                    <p className="text-sm font-medium text-gray-700">
                      {content.section.title}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Posición: {content.position}</span>
                  <span>
                    {new Date(content.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Total de contenidos: <span className="font-medium">{contents.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicContentsPage;