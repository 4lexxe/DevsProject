import React, { useState, useEffect, useCallback } from "react";
import { ResourceService } from "../../services/resource.service";
import { UserService } from "../../../profile/services/user.service";
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
  createdAt: string; // Fecha de creación del recurso
}

interface UserInfo {
  id: number;
  name: string;
  avatar?: string;
}

const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<Record<number, UserInfo>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener información del usuario
  const fetchUserInfo = useCallback(async (userId: number) => {
    try {
      const userInfo = await UserService.getUserById(userId);
      return {
        id: userInfo.id,
        name: userInfo.name,
        avatar:
          userInfo.avatar ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo.name)}&background=random`,
      };
    } catch (error) {
      console.error(`Error fetching user info for userId ${userId}:`, error);
      return {
        id: userId,
        name: `Usuario ${userId}`,
        avatar: `https://ui-avatars.com/api/?name=U${userId}&background=random`,
      };
    }
  }, []);

  // Procesar información de usuarios para todos los recursos
  const processUserInfo = useCallback(
    async (resources: Resource[]) => {
      const userIds = [...new Set(resources.map((resource) => resource.userId))];
      const userInfoMap: Record<number, UserInfo> = {};
      await Promise.all(
        userIds.map(async (userId) => {
          userInfoMap[userId] = await fetchUserInfo(userId);
        })
      );
      setUsers(userInfoMap);
    },
    [fetchUserInfo]
  );

  // Obtener recursos y ordenarlos por fecha de creación (más reciente primero)
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ResourceService.getResources();

      // Ordenar los recursos por createdAt en orden descendente
      const sortedResources: Resource[] = data.sort(
        (a: Resource, b: Resource) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setResources(sortedResources);
      await processUserInfo(sortedResources);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Error al cargar los recursos. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  }, [processUserInfo]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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