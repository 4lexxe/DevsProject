import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Shield,
  Search,
  Key,
  Users,
  AlertCircle,
} from 'lucide-react';
import { RoleService } from '@/user/services/role.service';
import type { Role, Permission } from '@/user/interfaces/role.interface';
import toast from 'react-hot-toast';
import { useDebounce } from '@/dashboard/hooks/useDebounce';

const RolesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Query para obtener todos los roles
  const {
    data: roles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['roles'],
    queryFn: () => RoleService.getRolesWithPermissions(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutación para eliminar un rol
  const deleteMutation = useMutation({
    mutationFn: (roleId: number) => RoleService.deleteRole(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Rol eliminado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message ||
        'Error al eliminar el rol. Puede que tenga usuarios asignados.';
      toast.error(errorMessage);
    },
  });

  // Filtrado del lado del cliente
  const filteredRoles = useMemo(() => {
    if (!roles.length) return [];

    return roles.filter((role: Role) => {
      if (debouncedSearchTerm) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const matchesSearch =
          role.name?.toLowerCase().includes(searchLower) ||
          role.description?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [roles, debouncedSearchTerm]);

  // Handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleDelete = useCallback(
    (roleId: number, roleName: string) => {
      if (
        window.confirm(
          `¿Estás seguro de que deseas eliminar el rol "${roleName}"? Esta acción no se puede deshacer.`
        )
      ) {
        deleteMutation.mutate(roleId);
      }
    },
    [deleteMutation]
  );

  // Estadísticas
  const stats = useMemo(() => {
    const uniquePermissions = new Set<number>();
    roles.forEach((r: Role) => {
      r.Permissions?.forEach((p: Permission) => {
        uniquePermissions.add(p.id);
      });
    });

    return {
      totalRoles: roles.length,
      rolesWithPermissions: roles.filter(
        (r: Role) => r.Permissions && r.Permissions.length > 0
      ).length,
      totalPermissions: uniquePermissions.size,
    };
  }, [roles]);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-red-800">Error al cargar los roles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary-600" />
            Gestión de Roles
          </h1>
          <p className="text-gray-600 mt-1">
            Administra roles y permisos del sistema
          </p>
        </div>
        <Link
          to="/roles/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Nuevo Rol
        </Link>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Roles</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRoles}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <Key className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Roles con Permisos</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.rolesWithPermissions}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Permisos</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPermissions}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar roles por nombre o descripción..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Tabla de Roles */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary-600"></div>
            <p className="mt-2 text-gray-600">Cargando roles...</p>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {searchTerm
                ? 'No se encontraron roles con ese criterio de búsqueda'
                : 'No hay roles registrados'}
            </p>
            {!searchTerm && (
              <Link
                to="/roles/new"
                className="inline-flex items-center gap-2 mt-4 text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-5 w-5" />
                Crear el primer rol
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permisos
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRoles.map((role: Role) => (
                  <tr key={role.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                          <Shield className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {role.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {role.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {role.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {role.Permissions?.length || 0} permisos
                        </span>
                      </div>
                      {role.Permissions && role.Permissions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {role.Permissions.slice(0, 3).map(
                            (permission: Permission) => (
                              <span
                                key={permission.id}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {permission.name}
                              </span>
                            )
                          )}
                          {role.Permissions.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{role.Permissions.length - 3} más
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/roles/${role.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar rol"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(role.id, role.name)}
                          className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar rol"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Información adicional */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              Información sobre roles y permisos
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Los roles definen conjuntos de permisos que pueden ser asignados
              a usuarios. Eliminar un rol puede afectar a los usuarios que lo
              tienen asignado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
