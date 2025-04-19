import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResourceService } from '../../services/resource.service';
import { UserService } from '../../../profile/services/user.service';
import { Resource, UserInfo } from '../../types/resource';
import ResourceHeader from '../../navigation/ResourceDetailHeader';
import ResourceContent from '../../components/ResourceContent';
import ResourceInfo from '../../components/ResourceInfo';
import ResourceActions from '../../components/ResourceActions';
import Comment from '../../components/Comment';

const ResourceDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [resourceUser, setResourceUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResourceAndUser = async () => {
      try {
        setLoading(true);
        const resourceData = await ResourceService.getResourceById(Number(id));
        setResource(resourceData);
        const userData = await UserService.getUserById(resourceData.userId);
        setResourceUser(userData);
      } catch (err) {
        console.error('Error fetching resource details:', err);
        setError('Error al cargar el recurso. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchResourceAndUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-800"></div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
            <p className="text-red-700">{error || 'Recurso no encontrado'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ResourceHeader resource={resource} />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal - Contenido y comentarios */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contenido del recurso */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <ResourceContent resource={resource} />
            </div>

            {/* Información del recurso - Visible en móvil */}
            <div className="lg:hidden">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <ResourceInfo resource={resource} user={resourceUser} />
              </div>
            </div>

            {/* Comentarios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <Comment resourceId={resource.id!} />
            </div>
          </div>

          {/* Sidebar - Información y acciones */}
          <div className="lg:col-span-1 space-y-8">
            {/* Información del recurso - Visible en desktop */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
                <ResourceInfo resource={resource} user={resourceUser} />
              </div>
            </div>

            {/* Acciones del recurso */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-[400px]">
              <ResourceActions 
                resourceId={resource.id!} 
                ownerId={resource.userId!} 
                onShare={() => navigator.clipboard.writeText(window.location.href)} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDetailsPage;