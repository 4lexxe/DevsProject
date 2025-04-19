import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XIcon, PencilIcon, FilterIcon, RefreshCw, AlertTriangle, LockIcon, Search, UserPlus, Shield } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../../../profile/services/user.service';
import { RoleService } from '../../../profile/services/role.service';
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
  permissions?: Permission[];
}

interface RoleCreateRequest {
  name: string;
  description: string;
  permissionIds: number[];
}

interface RoleUpdateRequest {
  name: string;
  description: string;
  permissionIds: number[];
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

// Componente para el modal de edición de roles
interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSave: (role: RoleCreateRequest | RoleUpdateRequest) => void;
  isLoading: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role, onSave, isLoading }) => {
  const [formData, setFormData] = useState<RoleCreateRequest | RoleUpdateRequest>({
    name: role?.name || '',
    description: role?.description || '',
    permissionIds: role?.permissions?.map(p => p.id) || []
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissionIds: role.permissions?.map(p => p.id) || []
      });
    } else {
      // Reset form when creating a new role
      setFormData({
        name: '',
        description: '',
        permissionIds: []
      });
    }
  }, [role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">
            {role ? `Editar Rol: ${role.name}` : 'Crear Nuevo Rol'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Rol
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del rol"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del rol"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              disabled={isLoading}
            >
              {isLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              {role ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
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
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
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

  // Consulta para obtener todos los roles (ahora usando RoleService)
  const { 
    data: rolesData = [], 
    isLoading: isLoadingRoles,
    refetch: refetchRoles
  } = useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        return await RoleService.getRoles();
      } catch (error) {
        console.error("Error fetching roles:", error);
        // Usar los roles extraídos de los usuarios como fallback
        return roles;
      }
    },
    initialData: roles // Usar los roles extraídos de los usuarios como datos iniciales
  });

  // Asegurar que roles es siempre la fuente de verdad más actualizada
  const roles = React.useMemo(() => {
    // Si tenemos datos de la API, los usamos
    if (rolesData && rolesData.length > 0) {
      return rolesData;
    }
    
    // Si no, extraemos roles de los usuarios como respaldo
    const uniqueRoles = new Map<number, Role>();
    
    users.forEach((user: User) => {
      if (user.Role && !uniqueRoles.has(user.Role.id)) {
        uniqueRoles.set(user.Role.id, user.Role);
      }
    });
    
    return Array.from(uniqueRoles.values());
  }, [rolesData, users]);

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

  // Mutación para crear un nuevo rol
  const createRoleMutation = useMutation({
    mutationFn: (roleData: RoleCreateRequest) => RoleService.createRole(roleData),
    onSuccess: () => {
      toast.success('Rol creado correctamente');
      refetchRoles();
      setRoleModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Error al crear rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Mutación para actualizar un rol
  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: RoleUpdateRequest }) => 
      RoleService.updateRole(id, data),
    onSuccess: () => {
      toast.success('Rol actualizado correctamente');
      refetchRoles();
      setRoleModalOpen(false);
    },
    onError: (error) => {
      toast.error(`Error al actualizar rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Mutación para eliminar un rol
  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => RoleService.deleteRole(id),
    onSuccess: () => {
      toast.success('Rol eliminado correctamente');
      refetchRoles();
    },
    onError: (error) => {
      toast.error(`Error al eliminar rol: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Manejador para guardar un rol (crear o actualizar)
  const handleSaveRole = (roleData: RoleCreateRequest | RoleUpdateRequest) => {
    if (editingRole) {
      // Actualizar rol existente
      updateRoleMutation.mutate({ id: editingRole.id, data: roleData });
    } else {
      // Crear nuevo rol
      createRoleMutation.mutate(roleData as RoleCreateRequest);
    }
  };

  // Manejador para editar un rol
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleModalOpen(true);
  };

  // Manejador para crear un nuevo rol
  const handleCreateRole = () => {
    setEditingRole(null);
    setRoleModalOpen(true);
  };

  // Manejador para eliminar un rol
  const handleDeleteRole = (roleId: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este rol? Esta acción no se puede deshacer.')) {
      deleteRoleMutation.mutate(roleId);
    }
  };

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
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mb-2">
              Control de Acceso
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Roles</h2>
          </div>
          <button 
            onClick={handleCreateRole}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              <div 
                key={role.id} 
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex justify-between items-start">
        
        {isLoadingRoles ? (
          <div className="flex justify-center items-center p-12">
            <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div 
                key={role.id} 
                className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              ></div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 text-lg mb-1">{role.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{role.description || `Rol de ${role.name}`}</p>
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                      onClick={() => handleEditRole(role)}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    </button>
                    <button 
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar rol"
                    ></button>
                      <XIcon className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">Usuarios con este rol:</p>
                  <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    ID: {role.id}
                  </span>
                  <button 
                    onClick={() => handleEditRole(role)}
                        <div key={user.id} className="inline-flex items-center bg-gray-100 rounded-full px-2.5 py-0.5 text-xs">
                  >
                    Ver permisos
                  </button>
                            <div className="w-4 h-4 rounded-full bg-gray-300 mr-1 flex items-center justify-center text-[10px] font-bold">
                
                <div className="mt-4 pt-4 border-t border-gray-100"></div>
                  <p className="text-xs text-gray-500 mb-2">Usuarios con este rol:</p>
                  <div className="flex flex-wrap gap-2">
                    {users
                      .filter((user: User) => user.roleId === role.id)
                      .slice(0, 3)
                      <div className="inline-flex items-center bg-gray-100 rounded-full px-2.5 py-0.5 text-xs">
                        +{users.filter((user: User) => user.roleId === role.id).length - 3} más
                      </div>
                        <div key={user.id} className="inline-flex items-center bg-gray-100 rounded-full px-2.5 py-0.5 text-xs"></div>
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-4 h-4 rounded-full mr-1" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-300 mr-1 flex items-center justify-center text-[10px] font-bold"></div>
                              {user.name.charAt(0)}
                            </div>
                          )}
                          {user.name}
                        </div>
                      ))}
                    {users.filter((user: User) => user.roleId === role.id).length > 3 && (
                      <div className="inline-flex items-center bg-gray-100 rounded-full px-2.5 py-0.5 text-xs"></div>
                        +{users.filter((user: User) => user.roleId === role.id).length - 3} más
                      </div>
                    )}
                    {users.filter((user: User) => user.roleId === role.id).length === 0 && (
                      <span className="text-xs text-gray-400 italic">No hay usuarios con este rol</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modales */}
      <PermissionModal 
        isOpen={permissionModalOpen}
        onClose={() => setPermissionModalOpen(false)}
        userId={selectedUser}
        username={selectedUsername}
      />
      
      <RoleModal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        role={editingRole}
        onSave={handleSaveRole}
        isLoading={createRoleMutation.isPending || updateRoleMutation.isPending}
      />
    </div>
  );
};

export default PermissionsPage;
