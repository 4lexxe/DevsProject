import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceService } from '../services/resource.service';

interface ResourceUser {
  id: number;
  name: string;
  username?: string;
  displayName?: string;
}

interface Resource {
  id: number;
  title: string;
  description?: string;
  url: string;
  type: 'video' | 'document' | 'image' | 'link';
  isVisible: boolean;
  coverImage?: string;
  userId: number;
  User: ResourceUser; // La información del usuario ya viene incluida
  createdAt: string;
  updatedAt: string;
}

const ResourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResourceDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!id) {
        setError('ID de recurso no válido');
        return;
      }

      // Obtener el recurso que ya incluye la información del usuario
      const resourceData = await ResourceService.getResourceById(parseInt(id));
      
      // Manejar diferentes estructuras de respuesta
      let resourceInfo: Resource;
      if (resourceData.data) {
        resourceInfo = resourceData.data;
      } else {
        resourceInfo = resourceData;
      }

      setResource(resourceInfo);

    } catch (err) {
      console.error('Error fetching resource details:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al obtener el recurso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResourceDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl mb-4">Error: {error}</div>
        <button 
          onClick={fetchResourceDetails}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 text-xl">Recurso no encontrado</div>
      </div>
    );
  }

  // Helper para obtener el nombre del autor
  const getAuthorName = (user: ResourceUser): string => {
    return user.displayName || user.name || user.username || 'Usuario desconocido';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Imagen de portada */}
        {resource.coverImage && (
          <div className="mb-8">
            <img 
              src={resource.coverImage} 
              alt={resource.title}
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Contenido principal */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Encabezado */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
              resource.type === 'video' ? 'bg-red-100 text-red-800' :
              resource.type === 'document' ? 'bg-blue-100 text-blue-800' :
              resource.type === 'image' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {resource.type}
            </span>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {resource.title}
            </h1>
            
            <div className="flex items-center text-gray-600 mb-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  {getAuthorName(resource.User).charAt(0).toUpperCase()}
                </div>
                <span>Por: {getAuthorName(resource.User)}</span>
              </div>
              <span className="mx-3">•</span>
              <span>
                {new Date(resource.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Descripción */}
          {resource.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>
          )}

          {/* Botón para acceder al recurso */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Acceder al Recurso
            </a>
            
            <button 
              onClick={() => navigator.clipboard.writeText(resource.url)}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copiar URL
            </button>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Recurso</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Tipo</dt>
              <dd className="text-sm text-gray-900 capitalize">{resource.type}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Publicado por</dt>
              <dd className="text-sm text-gray-900">{getAuthorName(resource.User)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Fecha de creación</dt>
              <dd className="text-sm text-gray-900">
                {new Date(resource.createdAt).toLocaleDateString('es-ES')}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Última actualización</dt>
              <dd className="text-sm text-gray-900">
                {new Date(resource.updatedAt).toLocaleDateString('es-ES')}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsPage;
