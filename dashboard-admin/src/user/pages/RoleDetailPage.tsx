import { useQuery } from '@tanstack/react-query';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Key,
  Edit2,
  Users,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { RoleService } from '@/user/services/role.service';
import type { Role, Permission } from '@/user/interfaces/role.interface';

const RoleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Query para obtener el rol
  const {
    data: roleData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['role', id],
    queryFn: () => RoleService.getRoleById(Number(id)),
    enabled: !!id,
  });

  const role: Role | undefined = roleData?.data;

  // Agrupar permisos por categoría (módulo)
  const groupPermissionsByCategory = (permissions: Permission[]) => {
    const groups: Record<string, Permission[]> = {};

    permissions?.forEach((permission) => {
      // Ahora el formato es recurso:acción, tomamos el recurso como categoría
      const category = permission.name.split(':')[0] || 'otros';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(permission);
    });

    return groups;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryName = (category: string) => {
    const categoryNames: Record<string, string> = {
      // Módulos principales
      courses: '🎓 Cursos',
      content: '📚 Contenido de Cursos',
      sections: '📑 Secciones',
      enrollments: '✍️ Inscripciones',
      progress: '📊 Progreso',
      users: '👥 Usuarios',
      profile: '👤 Perfiles',
      roles: '🔐 Roles',
      permissions: '🔑 Permisos',
      categories: '📁 Categorías',
      resources: '📎 Recursos',
      comments: '💬 Comentarios',
      ratings: '⭐ Calificaciones',
      sales: '💰 Ventas',
      discounts: '🏷️ Descuentos',
      analytics: '📈 Analíticas',
      community: '🌐 Comunidad',
      groups: '👨‍👩‍👧‍👦 Grupos',
      system: '⚙️ Sistema',
      otros: '📦 Otros',
    };
    return categoryNames[category] || category;
  };

  const getRoleBadgeColor = (roleName: string) => {
    const colors: Record<string, string> = {
      superadmin: 'bg-red-100 text-red-800 border-red-300',
      admin: 'bg-purple-100 text-purple-800 border-purple-300',
      moderator: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      instructor: 'bg-blue-100 text-blue-800 border-blue-300',
      student: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
          <p className="text-gray-600">Cargando información del rol...</p>
        </div>
      </div>
    );
  }

  if (error || !role) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-center gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          <div>
            <h3 className="text-red-900 font-semibold">Error al cargar el rol</h3>
            <p className="text-red-700 text-sm mt-1">
              No se pudo encontrar el rol solicitado.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/roles')}
          className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a roles
        </button>
      </div>
    );
  }

  const groupedPermissions = groupPermissionsByCategory(role.Permissions || []);
  const permissionCount = role.Permissions?.length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/roles')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Volver a roles</span>
        </button>
        <Link
          to={`/roles/${id}/edit`}
          className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Edit2 className="h-4 w-4" />
          Editar Rol
        </Link>
      </div>

      {/* Información del Rol */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border mb-2 ${getRoleBadgeColor(
                    role.name
                  )}`}
                >
                  {role.name}
                </span>
                <h1 className="text-3xl font-bold text-white">{role.name}</h1>
                <p className="text-primary-100 mt-1">{role.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Key className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Permisos Asignados</p>
                <p className="text-xl font-bold text-gray-900">{permissionCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Creado</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(role.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Actualizado</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(role.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Permisos Agrupados por Categoría */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Key className="h-6 w-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Permisos del Rol
              </h2>
              <p className="text-sm text-gray-600">
                {permissionCount} permisos en {Object.keys(groupedPermissions).length}{' '}
                categorías
              </p>
            </div>
          </div>
        </div>

        {permissionCount === 0 ? (
          <div className="p-12 text-center">
            <Key className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Sin permisos asignados
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Este rol no tiene permisos asignados todavía.
            </p>
            <Link
              to={`/roles/${id}/edit`}
              className="mt-4 inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <Edit2 className="h-4 w-4" />
              Asignar permisos
            </Link>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(groupedPermissions).map(([category, permissions]) => (
                <div
                  key={category}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    {getCategoryName(category)}
                    <span className="text-xs text-gray-500 font-normal">
                      ({permissions.length})
                    </span>
                  </h3>
                  <ul className="space-y-2">
                    {permissions.map((permission) => (
                      <li
                        key={permission.id}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">
                            {permission.name}
                          </p>
                          {permission.description && (
                            <p className="text-gray-600 text-xs mt-0.5">
                              {permission.description}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Información Adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900">
              Sobre los roles y permisos
            </h3>
            <p className="text-sm text-blue-800 mt-1">
              Los roles determinan las acciones que los usuarios pueden realizar en el
              sistema. Cada rol agrupa un conjunto de permisos específicos que definen
              el acceso a diferentes funcionalidades.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetailPage;
