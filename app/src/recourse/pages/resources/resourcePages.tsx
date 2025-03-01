import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ResourceService } from "../../services/resource.service";
import { UserService } from "../../../profile/services/user.service";
import ResourceListHeader from "../../navigation/ResourceListHeader";
import ResourceCard from "../../components/ResourceCard";
import ResourceFilter, { ResourceFilters } from "../../components/ResourceFilter";


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
  const [allResources, setAllResources] = useState<Resource[]>([]); // Almacena todos los recursos sin filtrar
  const [users, setUsers] = useState<Record<number, UserInfo>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResourceFilters>({
    types: [],
    dateRange: {
      from: null,
      to: null
    },
    searchTerm: ''
  });

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

      setAllResources(sortedResources); // Guardar todos los recursos
      setResources(sortedResources); // Inicialmente mostrar todos
      await processUserInfo(sortedResources);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Error al cargar los recursos. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  }, [processUserInfo]);

  // Aplicar filtros a los recursos
  const applyFilters = useCallback((currentFilters: ResourceFilters) => {
    let filteredResources = [...allResources];
    
    // Filtrar por tipo
    if (currentFilters.types.length > 0) {
      filteredResources = filteredResources.filter(resource => 
        currentFilters.types.includes(resource.type)
      );
    }
    
    // Filtrar por rango de fechas
    if (currentFilters.dateRange.from) {
      const fromDate = new Date(currentFilters.dateRange.from);
      filteredResources = filteredResources.filter(resource => 
        new Date(resource.createdAt) >= fromDate
      );
    }
    
    if (currentFilters.dateRange.to) {
      const toDate = new Date(currentFilters.dateRange.to);
      // Ajustar la fecha "hasta" para incluir todo el día
      toDate.setHours(23, 59, 59, 999);
      filteredResources = filteredResources.filter(resource => 
        new Date(resource.createdAt) <= toDate
      );
    }
    
    // Filtrar por término de búsqueda
    if (currentFilters.searchTerm.trim()) {
      const searchTerm = currentFilters.searchTerm.toLowerCase().trim();
      filteredResources = filteredResources.filter(resource => 
        resource.title.toLowerCase().includes(searchTerm) || 
        (resource.description && resource.description.toLowerCase().includes(searchTerm))
      );
    }
    
    setResources(filteredResources);
  }, [allResources]);

  // Manejar cambios en los filtros
  const handleFilterChange = useCallback((newFilters: ResourceFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  }, [applyFilters]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Calcular si hay recursos filtrados
  const hasFilteredResults = useMemo(() => {
    return resources.length > 0;
  }, [resources]);

  // Calcular si hay filtros activos
  const hasActiveFilters = useMemo(() => {
    return filters.types.length > 0 || 
           filters.dateRange.from !== null || 
           filters.dateRange.to !== null ||
           filters.searchTerm.trim() !== '';
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ResourceListHeader />

        {/* Mostrar mensaje de error si ocurre */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-md animate-fade-in">
            {error}
          </div>
        )}

        {/* Contenedor principal con grid para filtro y contenido */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Columna de filtros (lateral en desktop, arriba en móvil) */}
          <div className="md:col-span-1">
            <ResourceFilter 
              onFilterChange={handleFilterChange}
              className="sticky top-24"
            />
          </div>

          {/* Columna de contenido principal */}
          <div className="md:col-span-3">
            {/* Mostrar indicador de carga o lista de recursos */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-gray-900"></div>
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                {hasActiveFilters ? (
                  <div className="space-y-2">
                    <p className="text-gray-500 text-lg">No se encontraron recursos con los filtros aplicados.</p>
                    <button 
                      onClick={() => handleFilterChange({
                        types: [],
                        dateRange: { from: null, to: null },
                        searchTerm: ''
                      })}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-500 text-lg">No hay recursos disponibles.</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Contador de resultados */}
                <div className="text-sm text-gray-500 mb-2">
                  {resources.length} {resources.length === 1 ? 'recurso encontrado' : 'recursos encontrados'}
                  {hasActiveFilters && ' con los filtros aplicados'}
                </div>
                
                {/* Grid de tarjetas de recursos */}
                <div className="grid gap-6">
                  {resources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      resource={resource}
                      user={users[resource.userId]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceListPage;