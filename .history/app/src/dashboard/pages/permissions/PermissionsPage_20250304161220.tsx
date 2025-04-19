import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XIcon, PencilIcon, FilterIcon, ShieldIcon, RefreshCw, AlertTriangle, Search, Lock, Unlock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../../../profile/services/user.service';
import toast from 'react-hot-toast';

// Interfaces que reflejan el modelo de datos
interface User {
  id: number;
  name: string;
  email: string | null;
  roleId: number;
  username: string | null;
  displayName: string | null;
  avatar: string | null;
  isActiveSession: boolean;
  Role?: Role;
  Permissions?: Permission[];
  lastActiveAt?: Date | null;
}

interface Role {
  id: number;
  name: string;
  description: string;
  Permissions?: Permission[];
}

interface Permission {
  id: number;
  name: string;
  description: string;
  isBlocked?: boolean; // Para marcar permisos bloqueados para el usuario
}

interface PermissionRequest {
  userId: number;
  permissionName: string;
  description?: string;
}

const PermissionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Consulta para obtener todos los usuarios con sus roles y permisos
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const usersData = await UserService.getUsers();
      // Para mostrar datos de ejemplo si la API aún no está implementada
      if (usersData.length === 0) {
        return [
          { 
            id: 1, 
            name: 'John Doe', 
            email: 'john@example.com', 
            roleId: 2, 
            username: 'johndoe',
            displayName: 'John D.',
            isActiveSession: true,
            Role: { id: 2, name: 'admin', description: 'Administrator' },
            Permissions: [
              { id: 1, name: 'manage:users', description: 'Can manage users' }
            ]
          },
          { 
            id: 2, 
            name: 'Jane Smith', 
            email: 'jane@example.com', 
            roleId: 1,
            username: 'janesmith',
            displayName: 'Jane S.',
            isActiveSession: true,
            Role: { id: 1, name: 'user', description: 'Regular user' },
            Permissions: []
          },
        ];
      }
      return usersData;
    },
  });

  // Consulta para obtener todos los permisos disponibles
  const { 
    data: availablePermissions = [], 
    isLoading: isLoadingPermissions 
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      try {
        const permissionsData = await UserService.getAvailablePermissions();
        if (permissionsData.length === 0) {
          // Datos de ejemplo si la API aún no está implementada
          return [
            { id: 1, name: 'manage:users', description: 'Can view, create, edit, and delete users' },
            { id: 2, name: 'manage:content', description: 'Can create, edit, and delete content' },
            { id: 3, name: 'view:reports', description: 'Can view analytics and reports' },
            { id: 4, name: 'manage:courses', description: 'Can manage courses' },
          ];
        }
        return permissionsData;
      } catch (error) {
        console.error("Error fetching permissions:", error);
        return [];
      }
    },
  });

  // Consulta para obtener permisos del usuario seleccionado
  const { 
    data: userPermissions = [],
    isLoading: isLoadingUserPermissions,
    refetch: refetchUserPermissions
  } = useQuery({
    queryKey: ['userPermissions', selectedUser],
    queryFn: () => selectedUser ? UserService.getUserPermissions(selectedUser) : Promise.resolve([]),
    enabled: !!selectedUser,
  });

  // Mutaciones para operaciones de permisos
  const assignPermissionMutation = useMutation({
    mutationFn: UserService.assignCustomPermission,
    onSuccess: () => {
      toast.success('Permiso asignado correctamente');
      if (selectedUser) {
        queryClient.invalidateQueries({ queryKey: ['userPermissions', selectedUser] });
        refetchUserPermissions();
      }
    },
    onError: (error) => {
      toast.error(`Error al asignar permiso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  const blockPermissionMutation = useMutation({
    mutationFn: UserService.blockPermission,
    onSuccess: () => {
      toast.success('Permiso bloqueado correctamente');
      if (selectedUser) {
        queryClient.invalidateQueries({ queryKey: ['userPermissions', selectedUser] });
        refetchUserPermissions();
      }
    },
    onError: (error) => {
      toast.error(`Error al bloquear permiso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  const unblockPermissionMutation = useMutation({
    mutationFn: UserService.unblockPermission,
    onSuccess: () => {
      toast.success('Permiso desbloqueado correctamente');
      if (selectedUser) {
        queryClient.invalidateQueries({ queryKey: ['userPermissions', selectedUser] });
        refetchUserPermissions();
      }
    },
    onError: (error) => {
      toast.error(`Error al desbloquear permiso: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  // Mutación para actualizar el rol de un usuario
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => UserService.updateUser(id, data),
    onSuccess: () => {
      toast.success('Usuario actualizado correctamente');
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Error al actualizar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  });

  useEffect(() => {
    // Simular retardo de carga para la animación
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

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

  const handleAssignPermission = (permissionName: string) => {
    if (!selectedUser) return;
    
    assignPermissionMutation.mutate({
      userId: selectedUser,
      permissionName
    });
  };

  const handleBlockPermission = (permissionName: string) => {
    if (!selectedUser) return;
    
    blockPermissionMutation.mutate({
      userId: selectedUser,
      permissionName
    });
  };

  const handleUnblockPermission = (permissionName: string) => {
    if (!selectedUser) return;
    
    unblockPermissionMutation.mutate({
      userId: selectedUser,
      permissionName
    });
  };

  const handleOpenPermissionModal = (userId: number) => {
    setSelectedUser(userId);
    setPermissionModalOpen(true);
  };

  const handleClosePermissionModal = () => {
    setPermissionModalOpen(false);
    setSelectedUser(null);
  };

  const roleOptions = [
    { value: 'all', label: 'Todos los Roles' },
    { value: 'user', label: 'Usuario' },
    { value: 'admin', label: 'Administrador' },
    { value: 'superadmin', label: 'Super Admin' },
    { value: 'privileged', label: 'Privilegiado' },
  ];

  const roleMapping: Record<number, { name: string, label: string }> = {
    1: { name: 'user', label: 'Usuario' },
    2: { name: 'admin', label: 'Administrador' },
    3: { name: 'superadmin', label: 'Super Admin' },
    4: { name: 'privileged', label: 'Privilegiado' },
  };

  const selectedUserObj = selectedUser ? users.find((u: User) => u.id === selectedUser) : null;

  // Estado de carga de la página
  const isLoading = isLoadingUsers || isLoadingPermissions;

  if (isErrorUsers) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading users. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          onClick={() => refetchUsers()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="space-y-2">
          <div className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
            User Management
          </div>
          <h1 className="text-3xl font-bold text-gray-900">User Permissions</h1>
          <p className="text-gray-500">Manage user roles and permissions</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm transform hover:translate-y-[-2px] hover:shadow-md">
          <PlusIcon className="h-4 w-4 mr-2" />
          Add New User
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-8"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-64 relative">
            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Role</label>
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
          <p className="text-sm text-gray-500 mt-0 sm:mt-6">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>
      </div>
      
      {/* Users Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-10">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.roleId}
                      onChange={(e) => handleRoleChange(user.id, parseInt(e.target.value))}
                      className="block w-full max-w-[140px] pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
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
                      {user.isActiveSession ? 'Active' : 'Inactive'}
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
                      {user.isActiveSession ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 inline-flex items-center transition-colors"
                      onClick={() => handleOpenPermissionModal(user.id)}
                    >
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit
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
              Access Control
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Role Permissions</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
          {availablePermissions.map((permission) => (
            <div 
              key={permission.id} 
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
            ></div>
              <h3 className="font-medium text-gray-900 text-lg mb-1">{permission.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{permission.description}</p>
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`admin-${permission.id}`} 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" 
                    defaultChecked 
                  />
                  <label htmlFor={`admin-${permission.id}`} className="text-sm text-gray-900">Admin</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`superadmin-${permission.id}`} 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" 
                    defaultChecked 
                  />
                  <label htmlFor={`superadmin-${permission.id}`} className="text-sm text-gray-900">Super Admin</label>
                </div>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`privileged-${permission.id}`} 
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    defaultChecked={permission.id !== 1} 
                  />
                  <label htmlFor={`privileged-${permission.id}`} className="text-sm text-gray-900">Privileged</label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
