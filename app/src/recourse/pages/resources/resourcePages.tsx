import React, { useState, useEffect, useCallback } from "react";
import { ResourceService } from "../../services/resource.service";
import { UserService } from "../../../profile/services/user.service";
import ResourceListHeader from "../../navigation/ResourceListHeader";
import ResourceCard from "../../components/ResourceCard";
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

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

type SortOption = 'newest' | 'oldest';
type ResourceType = 'all' | 'video' | 'document' | 'image' | 'link';

const ITEMS_PER_PAGE = 10;

const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<Record<number, UserInfo>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedType, setSelectedType] = useState<ResourceType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Calcular recursos para la página actual
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  // Obtener recursos
  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const data = await ResourceService.getResources();
      setResources(data);
      await processUserInfo(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Error al cargar los recursos. Por favor, intenta nuevamente.");
      setLoading(false);
    }
  }, [processUserInfo]);

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let filtered = [...resources];

    // Filtrar por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType);
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resource => 
        resource.title.toLowerCase().includes(term) ||
        resource.description?.toLowerCase().includes(term) ||
        users[resource.userId]?.name.toLowerCase().includes(term)
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredResources(filtered);
    // Resetear a la primera página cuando se aplican filtros
    setCurrentPage(1);
  }, [resources, selectedType, searchTerm, sortBy, users]);

  // Actualizar total de páginas cuando cambian los recursos filtrados
  useEffect(() => {
    const total = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
    setTotalPages(total);
  }, [filteredResources]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Manejadores de paginación
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <ResourceListHeader />

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por título, descripción o usuario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filtros
            </button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Recurso
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as ResourceType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Todos los tipos</option>
                    <option value="video">Videos</option>
                    <option value="document">Documentos</option>
                    <option value="image">Imágenes</option>
                    <option value="link">Enlaces</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ordenar por
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="newest">Más recientes</option>
                    <option value="oldest">Más antiguos</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

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
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">
              {searchTerm || selectedType !== 'all' 
                ? 'No se encontraron recursos que coincidan con los filtros.'
                : 'No hay recursos disponibles.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-8">
              {paginatedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  user={users[resource.userId]}
                />
              ))}
            </div>

            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg border ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResourceListPage;