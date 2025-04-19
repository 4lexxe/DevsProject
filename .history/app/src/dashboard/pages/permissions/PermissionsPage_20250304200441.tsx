import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XIcon, PencilIcon, FilterIcon, RefreshCw, AlertTriangle, LockIcon, Search, UserPlus, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../../../profile/services/user.service';
import toast from 'react-hot-toast';

// Interfaces actualizadas para trabajar directamente con la respuesta del API
interface Permission {
  id: number;
  name: string;
  description: string;
}

interface UserPermission extends Permission {
  source: 'role' | 'custom';
}

interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  roleId: number;
  isActiveSession: boolean;
  Role?: {
    id: number;
    name: string;
    description: string;
  };
}

interface Role {
  id: number;
  name: string;
  description: string;
}

// Componente para el modal de permisos
interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number | null;
  username: string;
}

const PermissionModal: React.FC<PermissionModalProps> = ({ isOpen, onClose, userId, username }) => {
  const queryClient = useQueryClient();
  const [tabSelected, setTabSelected] = useState<'available' | 'blocked'>('available');
  
  const { data: permissionsData, isLoading } = useQuery({
    queryKey: ['userPermissions', userId],
    queryFn: () => userId ? UserService.getUserPermissions(userId) : null,
    enabled: !!userId && isOpen
  });
  
  // Mutaciones para gestionar permisos
  const blockPermissionMutation = useMutation({
    mutationFn: (permissionId: number) => 
      UserService.blockPermission({ userId: userId!, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      toast.success('Permiso bloqueado correctamente');
    }
  });
  
  const unblockPermissionMutation = useMutation({
    mutationFn: (permissionId: number) => 
      UserService.unblockPermission({ userId: userId!, permissionId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPermissions', userId] });
      toast.success('Permiso desbloqueado correctamente');
    }
  });
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-lg font-medium">Gestionar Permisos</h3>
            <p className="text-sm text-gray-500">Usuario: {username}</p>
            {permissionsData && (
              <p className="text-sm text-gray-500">Rol: {permissionsData.roleName}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 ${tabSelected === 'available' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
              onClick={() => setTabSelected('available')}
            >
              Permisos Disponibles
            </button>
            <button 
              className={`px-4 py-2 ${tabSelected === 'blocked' ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-500'}`}
              onClick={() => setTabSelected('blocked')}
            >
              Permisos Bloqueados
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center p-6">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : tabSelected === 'available' ? (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
              <h4 className="font-medium text-gray-900">Permisos por Rol</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsData?.availablePermissions
                  .filter(p => p.source === 'role')
                  .map(permission => (
                    <div key={permission.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1 mr-2">
                        <div className="font-medium truncate">{permission.name}</div>
                        <div className="inline-flex items-center mt-1 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                          <Shield className="h-3 w-3 mr-1" /> Rol
                        </div>
                      </div>
                      <button 
                        onClick={() => blockPermissionMutation.mutate(permission.id)}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors whitespace-nowrap"
                      >
                        Bloquear
                      </button>
                    </div>
                  ))}
              </div>
                
              <h4 className="font-medium text-gray-900 mt-6">Permisos Personalizados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsData?.availablePermissions
                  .filter(p => p.source === 'custom')
                  .map(permission => (
                    <div key={permission.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1 mr-2">
                        <div className="font-medium truncate">{permission.name}</div>
                        <div className="inline-flex items-center mt-1 text-xs bg-purple-100 text-purple-800 rounded-full px-2 py-0.5">
                          <Shield className="h-3 w-3 mr-1" /> Personal
                        </div>
                      </div>
                      <button 
                        onClick={() => blockPermissionMutation.mutate(permission.id)}
                        className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors whitespace-nowrap"
                      >
                        Bloquear
                      </button>
                    </div>
                  ))}
              </div>
                
              {permissionsData?.availablePermissions.filter(p => p.source === 'custom').length === 0 && (
                <p className="text-center py-4 text-gray-500">
                  Este usuario no tiene permisos personalizados
                </p>
              )}
              
              {permissionsData?.availablePermissions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Este usuario no tiene permisos disponibles
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
              <h4 className="font-medium text-gray-900">Permisos Bloqueados</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {permissionsData?.blockedPermissions?.map(permission => (
                  <div key={permission.id} className="flex justify-between items-center p-3 border rounded-lg bg-gray-50">
                    <div className="flex-1 mr-2">
                      <div className="font-medium truncate">{permission.name}</div>
                      <div className="inline-flex items-center mt-1 text-xs bg-red-100 text-red-800 rounded-full px-2 py-0.5">
                        <LockIcon className="h-3 w-3 mr-1" /> Bloqueado
                      </div>
                    </div>
                    <button 
                      onClick={() => unblockPermissionMutation.mutate(permission.id)}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm hover:bg-green-200 transition-colors whitespace-nowrap"
                    >
                      Desbloquear
                    </button>
                  </div>
                ))}
              </div>
              
              {(permissionsData?.blockedPermissions?.length || 0) === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Este usuario no tiene permisos bloqueados
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center p-6 border-t">
          <div className="text-sm text-gray-500">
            Total: {tabSelected === 'available' 
              ? permissionsData?.availablePermissions.length || 0 
              : permissionsData?.blockedPermissions.length || 0} permisos
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

const PermissionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedUsername, setSelectedUsername] = useState<string>('');
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Consulta para obtener todos los usuarios
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      try {
        return await UserService.getUsers();
      } catch (error) {
        console.error("Error fetching users:", error);
        // Devolvemos un array vacío en caso de error
        return [];
      }
    }
  });

  // Extraer roles de los usuarios
  const roles: Role[] = React.useMemo(() => {
    const uniqueRoles = new Map<number, Role>();
    
    users.forEach((user: User) => {
      if (user.Role && !uniqueRoles.has(user.Role.id)) {
        uniqueRoles.set(user.Role.id, user.Role);
      }
    });
    
    return Array.from(uniqueRoles.values());
  }, [users]);

  // Filtrar usuarios por rol y búsqueda
  const filteredUsers = users
    .filter((user: User) => 
      selectedRole === 'all' || (user.Role && user.Role.name === selectedRole)
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
      return UserService.updateUser(id, data);
    },
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
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

  const handleOpenPermissionModal = (userId: number, username: string) => {
    setSelectedUser(userId);
    setSelectedUsername(username);
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

  // Estado de carga global
  const isLoading = isLoadingUsers;

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
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: User) => (
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
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.description || role.name}</option>
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
                          onClick={() => handleStatusChange(user.id, !user.isActiveSession)}
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
                          onClick={() => handleOpenPermissionModal(user.id, user.username || user.email)}
                        >
                          <PencilIcon className="h-3 w-3 mr-1" />
                          Permisos
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron usuarios con los criterios de búsqueda
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Role Permissions Section */}
      <div>
        <div className="flex items-center mb-6">
          <div>
            <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mb-2">
              Control de Acceso
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Roles</h2>
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
              
              <div className="mt-4 flex justify-between">
                <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  ID: {role.id}
                </span>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer">
                  Ver permisos
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal de Permisos */}
      <PermissionModal 
        isOpen={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        userId={selectedUser}
        username={selectedUsername}
      />
    </div>
  );
};

export default PermissionsPage;
