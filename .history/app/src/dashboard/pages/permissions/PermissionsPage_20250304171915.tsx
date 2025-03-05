import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XIcon, PencilIcon, FilterIcon, RefreshCw, AlertTriangle, LockIcon, Search, UserPlus } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../../../profile/services/user.service';
import AuthService, { User } from '../../../auth/services/authService'; 
import toast from 'react-hot-toast';

// Actualizamos las interfaces para reflejar la estructura de datos de AuthService
interface Permission {
  id: number;
  name: string;
  description: string;
  isBlocked?: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: string[];
}

const PermissionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [authError, setAuthError] = useState<boolean>(false);

  // Consulta para verificar el estado de autenticación y obtener los datos del usuario actual
  const { 
    data: authData,
    isLoading: isLoadingAuth,
    isError: isErrorAuth 
  } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const response = await AuthService.verify();
        setAuthError(false);
        return response;
      } catch (error: any) {
        setAuthError(true);
        console.error("Authentication error:", error);
        return { authenticated: false };
      }
    },
    retry: false
  });

  // Consulta para obtener todos los usuarios
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        // Si tenemos acceso verificado, obtenemos los usuarios reales
        if (authData?.authenticated && authData?.user?.role?.name === 'superadmin') {
          const usersData = await UserService.getUsers();
          return usersData;
        }
        throw new Error('Unauthorized');
      } catch (error: any) {
        console.error("Error fetching users:", error);
        
        // Datos de ejemplo para desarrollo cuando no hay acceso
        return [
          { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com', 
            roleId: 2, 
            username: 'johndoe',
            displayName: 'John D.',
            isActiveSession: true,
            role: { id: 2, name: 'admin', description: 'Administrator', permissions: ['manage:users', 'manage:content'] }
          },
          { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane@example.com', 
            roleId: 1,
            username: 'janesmith',
            displayName: 'Jane S.',
            isActiveSession: true,
            role: { id: 1, name: 'user', description: 'Regular user', permissions: ['read:content'] }
          },
          {
            id: 3,
            name: 'Admin User',
            email: 'admin@example.com',
            roleId: 3,
            username: 'adminuser',
            displayName: 'Admin',
            isActiveSession: true,
            role: { id: 3, name: 'superadmin', description: 'Super Administrator', permissions: ['manage:users', 'manage:content', 'manage:roles', 'manage:permissions'] }
          }
        ];
      }
    },
    enabled: !isLoadingAuth,
    retry: false
  });

  // Obtenemos los roles disponibles basados en los usuarios
  const roles = React.useMemo(() => {
    const uniqueRoles: Record<string, Role> = {};
    
    users.forEach((user: User) => {
      if (user.role && !uniqueRoles[user.role.name]) {
        uniqueRoles[user.role.name] = user.role;
      }
    });
    
    return Object.values(uniqueRoles);
  }, [users]);

  // Consulta para obtener todos los permisos disponibles
  const { 
    data: availablePermissions = [], 
    isLoading: isLoadingPermissions 
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      try {
        // Intentamos obtener los permisos de la API
        const permissionsData = await UserService.getAvailablePermissions();
        return permissionsData;
      } catch (error) {
        console.error("Error fetching permissions:", error);
        
        // Extraemos permisos únicos de los roles
        const uniquePermissions: Set<string> = new Set();
        roles.forEach(role => {
          if (role.permissions) {
            role.permissions.forEach(perm => uniquePermissions.add(perm));
          }
        });
        
        // Transformamos a formato de objeto Permission
        return Array.from(uniquePermissions).map((perm, index) => ({
          id: index + 1,
          name: perm,
          description: `Permission to ${perm.replace(':', ' ')}`
        }));
      }
    },
    enabled: roles.length > 0,
    retry: false
  });

  // Filtrar usuarios por rol y búsqueda
  const filteredUsers = users
    .filter((user: User) => 
      selectedRole === 'all' || (user.role && user.role.name === selectedRole)
    )
    .filter((user: User) => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.username && user.username.toLowerCase().includes(query))
      );
    });

  // Mutación para actualizar el rol de un usuario
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => {
      if (authError) {
        // Simulamos una actualización exitosa para modo de desarrollo
        toast.success('Modo de prueba: Usuario actualizado (simulado)');
        return Promise.resolve({ success: true });
      }
      return UserService.updateUser(id, data);
    },
    onSuccess: () => {
      !authError && toast.success('Usuario actualizado correctamente');
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Error al actualizar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Configuramos el efecto para la animación de carga
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Manejadores de eventos
  const handleRoleChange = (userId: number, roleId: number) => {
    updateUserMutation.mutate({
      id: userId,
      data: { roleId }
    });
  };

  const handleStatusChange = (userId: number, isActive: boolean) => {
    updateUserMutation.mutate({
      id: userId,
      data: { isActiveSession: isActive }
    });
  };

  const handleOpenPermissionModal = (userId: number) => {
    setSelectedUser(userId);
    setPermissionModalOpen(true);
  };

  // Opciones de roles para el filtro
  const roleOptions = [
    { value: 'all', label: 'Todos los Roles' },
    ...roles.map(role => ({
      value: role.name,
      label: role.description || role.name
    }))
  ];

  // Mapeo de ID de roles a nombres
  const roleMapping: Record<number, { name: string, label: string }> = {};
  roles.forEach(role => {
    roleMapping[role.id] = {
      name: role.name,
      label: role.description || role.name
    };
  });

  // Estado de carga global
  const isLoading = isLoadingUsers || isLoadingPermissions || isLoadingAuth;

  // Verificamos si el usuario actual tiene permisos para administrar usuarios
  const hasAdminPermissions = React.useMemo(() => {
    if (!authData?.authenticated) return false;
    
    const userRole = authData?.user?.role;
    if (!userRole) return false;
    
    // Verificamos si el rol tiene permiso para administrar usuarios
    return (
      userRole.name === 'superadmin' || 
      userRole.name === 'admin' ||
      (userRole.permissions && userRole.permissions.includes('manage:users'))
    );
  }, [authData]);

  // Mensaje de restricción de acceso
  if (authData?.authenticated && !hasAdminPermissions) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <LockIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-medium">Acceso restringido:</span> No tienes los permisos necesarios para administrar usuarios y permisos.
              </p>
              <p className="text-sm text-yellow-700 mt-2">
                Por favor, contacta con un administrador si necesitas acceder a esta función.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si hay error de autenticación pero estamos en modo desarrollo
  const showDemoData = !authData?.authenticated || authError;

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
            Gestión de Usuarios
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Permisos de Usuario</h1>
          <p className="text-gray-500">Administra roles y permisos de usuarios</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm transform hover:translate-y-[-2px] hover:shadow-md">
          <UserPlus className="h-4 w-4 mr-2" />
          Añadir Usuario
        </button>
      </div>
      
      {/* Mensaje de datos de demostración */}
      {showDemoData && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Datos de demostración
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Los datos mostrados son simulados para propósitos de desarrollo. 
                  Las acciones no tendrán efecto en el servidor.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter and Search Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="w-full md:w-64 relative">
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Rol</label>
            <div className="relative">
              <select 
                id="role-filter"
                className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          <div className="w-full md:w-64 relative">
            <label htmlFor="search-users" className="block text-sm font-medium text-gray-700 mb-1">Buscar Usuarios</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                id="search-users"
                type="text"
                placeholder="Nombre, email o usuario..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mt-0 md:mt-8">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </p>
        </div>
      </div>
      
      {/* Users Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="h-8 w-8 rounded-full mr-3" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        {user.username && (
                          <div className="text-sm text-gray-500">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.roleId}
                      onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                      className="block w-full max-w-[160px] pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                    >
                      {Object.entries(roleMapping).map(([id, role]) => (
                        <option key={id} value={id}>{role.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-medium rounded-full items-center ${
                        user.isActiveSession 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActiveSession ? 
                        <CheckIcon className="h-3 w-3 mr-1" /> : 
                        <XIcon className="h-3 w-3 mr-1" />
                      }
                      {user.isActiveSession ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleStatusChange(
                        user.id, 
                        !user.isActiveSession
                      )}
                      className={`px-3 py-1 rounded-md inline-flex items-center transition-colors ${
                        user.isActiveSession 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {user.isActiveSession ? 
                        <XIcon className="h-3 w-3 mr-1" /> : 
                        <CheckIcon className="h-3 w-3 mr-1" />
                      }
                      {user.isActiveSession ? 'Desactivar' : 'Activar'}
                    </button>
                    <button 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 inline-flex items-center transition-colors"
                      onClick={() => handleOpenPermissionModal(user.id)}
                    >
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Permisos
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Role Permissions Section */}
      <div>
        <div className="flex items-center mb-6">
          <div>
            <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mb-2">
              Control de Acceso
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Permisos por Rol</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div 
              key={role.id} 
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
            >
              <h3 className="font-medium text-gray-900 text-lg mb-1">{role.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{role.description || `Rol de ${role.name}`}</p>
              
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                  Permisos ({role.permissions?.length || 0})
                </p>
                {role.permissions?.map((permission, index) => (
                  <div key={index} className="flex items-center">
                    <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{permission}</span>
                  </div>
                ))}
                {(!role.permissions || role.permissions.length === 0) && (
                  <p className="text-sm text-gray-400 italic">Sin permisos asignados</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
