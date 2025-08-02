import React, { useState, useEffect, useCallback } from "react";
import { ResourceService } from "../../services/resource.service";
import ResourceListHeader from "../../navigation/ResourceListHeader";
import ResourceCard from "../../components/ResourceCard";

interface Resource {
  id: number;
  type: string;
  title: string;
  description?: string;
  url: string;
  coverImage?: string;
  userId: number;
  User?: {
    id: number;
    name: string;
    username?: string;
    displayName?: string;
    avatar?: string;
  };
  createdAt: string;
}

interface UserInfo {
  id: number;
  name: string;
  username?: string;
  displayName?: string;
  avatar?: string;
}

const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<Record<number, UserInfo>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener recursos y ordenarlos por fecha de creación (más reciente primero)
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 Obteniendo recursos públicos...');
      const data = await ResourceService.getResources();
      
      // Los recursos ya incluyen la información del usuario del backend
      let resourceArray: Resource[] = [];
      if (Array.isArray(data)) {
        resourceArray = data;
      } else if (data && Array.isArray(data.data)) {
        resourceArray = data.data;
      } else {
        console.warn('Estructura de datos inesperada:', data);
        resourceArray = [];
      }

      const sortedResources: Resource[] = resourceArray.sort(
        (a: Resource, b: Resource) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setResources(sortedResources);
      
      // Extraer información del usuario directamente de los recursos (ya incluida por el backend)
      const userInfoMap: Record<number, UserInfo> = {};
      sortedResources.forEach(resource => {
        if (resource.User) {
          userInfoMap[resource.userId] = {
            id: resource.User.id,
            name: resource.User.name,
            username: resource.User.username,
            displayName: resource.User.displayName,
            avatar: resource.User.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(
              resource.User.displayName || resource.User.name || resource.User.username || `Usuario ${resource.User.id}`
            )}&background=random`,
          };
        } else {
          // Si por alguna razón no viene la información del usuario, crear datos básicos
          userInfoMap[resource.userId] = {
            id: resource.userId,
            name: `Usuario ${resource.userId}`,
            username: undefined,
            displayName: undefined,
            avatar: `https://ui-avatars.com/api/?name=Usuario+${resource.userId}&background=random`,
          };
        }
      });
      setUsers(userInfoMap);
      
      console.log('✅ Recursos y usuarios procesados correctamente');
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching resources:", err);
      setError("Error al cargar los recursos. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ResourceListHeader />

        {/* Mostrar mensaje de error si ocurre */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-fade-in">
            {error}
          </div>
        )}

        {/* Mostrar indicador de carga o lista de recursos */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-gray-900"></div>
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No hay recursos disponibles.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {resources.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                user={users[resource.userId]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceListPage;