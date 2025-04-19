import React, { useState } from 'react';
import { PlusIcon, CheckIcon, XIcon, PencilIcon, FilterIcon, RefreshCw, ShieldIcon } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../../../profile/services/user.service';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin' | 'privileged';
  status: 'active' | 'inactive';
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface UserPermission {
  id: number;
  userId: number;
  permissionName: string;
  permissionDescription?: string;
  isBlocked: boolean;
}

const PermissionsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);

  // Consulta para obtener todos los usuarios
  const { 
    data: users = [], 
    isLoading: isLoadingUsers,
    isError: isErrorUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => UserService.getUsers(),
  });

  // Consulta para obtener todos los permisos disponibles
  const { 
    data: availablePermissions = [], 
    isLoading: isLoadingPermissions 
  } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => UserService.getAvailablePermissions(),
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

  // Mutación para asignar un permiso personalizado
  const assignPermissionMutation = useMutation({
    mutationFn: UserService.assignCustomPermission,
    onSuccess: () => {
      toast.success('Permission assigned successfully');
      if (selectedUser) {
        refetchUserPermissions();
      }
    },
    onError: (error) => {
      toast.error(`Failed to assign permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Mutación para bloquear un permiso
  const blockPermissionMutation = useMutation({
    mutationFn: UserService.blockPermission,
    onSuccess: () => {
      toast.success('Permission blocked successfully');
      if (selectedUser) {
        refetchUserPermissions();
      }
    },
    onError: (error) => {
      toast.error(`Failed to block permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Mutación para desbloquear un permiso
  const unblockPermissionMutation = useMutation({
    mutationFn: UserService.unblockPermission,
    onSuccess: () => {
      toast.success('Permission unblocked successfully');
      if (selectedUser) {
        refetchUserPermissions();
      }
    },
    onError: (error) => {
      toast.error(`Failed to unblock permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Mutación para actualizar el rol de un usuario
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => UserService.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      refetchUsers();
    },
    onError: (error) => {
      toast.error(`Failed to update user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  // Filtrar usuarios por el rol seleccionado
  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter((user: User) => user.role === selectedRole);

  // Manejar cambio de rol
  const handleRoleChange = (userId: number, newRole: string) => {
    updateUserMutation.mutate({
      id: userId,
      data: { roleId: getRoleIdFromName(newRole) }
    });
  };

  // Manejar cambio de estado (activo/inactivo)
  const handleStatusChange = (userId: number, newStatus: 'active' | 'inactive') => {
    updateUserMutation.mutate({
      id: userId,
      data: { isActiveSession: newStatus === 'active' }
    });
  };

  // Abrir modal de permisos para un usuario específico
  const handleManagePermissions = (userId: number) => {
    setSelectedUser(userId);
    setPermissionModalOpen(true);
  };

  // Asignar un permiso a un usuario
  const handleAssignPermission = (permissionName: string) => {
    if (!selectedUser) return;
    
    assignPermissionMutation.mutate({
      userId: selectedUser,
      permissionName
    });
  };

  // Alternar el estado de bloqueo de un permiso
  const togglePermissionBlock = (permission: UserPermission) => {
    if (!selectedUser) return;
    
    if (permission.isBlocked) {
      unblockPermissionMutation.mutate({
        userId: selectedUser,
        permissionName: permission.permissionName
      });
    } else {
      blockPermissionMutation.mutate({
        userId: selectedUser,
        permissionName: permission.permissionName
      });
    }
  };

  // Convertir nombre de rol a ID (esto debe ajustarse según tu sistema)
  const getRoleIdFromName = (roleName: string): number => {
    const roleMap: Record<string, number> = {
      'user': 1,
      'admin': 2,
      'superadmin': 3,
      'privileged': 4
    };
    return roleMap[roleName] || 1;
  };

  // Obtener usuario seleccionado
  const getSelectedUser = () => {
    if (!selectedUser) return null;
    return users.find((user: User) => user.id === selectedUser) || null;
  };

  // Estado de carga para toda la página
  const isLoading = isLoadingUsers || isLoadingPermissions;
  
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
    { value: 'privileged', label: 'Privileged' },
  ];

  if (isErrorUsers) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          <p>Error loading users. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
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
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-8">
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
              {filteredUsers.map((user: User) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                      className="block w-full max-w-[140px] pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="privileged">Privileged</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs font-medium rounded-full items-center ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.status === 'active' ? 
                        <CheckIcon className="h-3 w-3 mr-1" /> : 
                        <XIcon className="h-3 w-3 mr-1" />
                      }
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleStatusChange(
                        user.id, 
                        user.status === 'active' ? 'inactive' : 'active'
                      )}
                      className={`px-3 py-1 rounded-md inline-flex items-center transition-colors ${
                        user.status === 'active' 
                          ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {user.status === 'active' ? 
                        <XIcon className="h-3 w-3 mr-1" /> : 
                        <CheckIcon className="h-3 w-3 mr-1" />
                      }
                      {user.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button 
                      onClick={() => handleManagePermissions(user.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 inline-flex items-center transition-colors"
                    >
                      <ShieldIcon className="h-3 w-3 mr-1" />
                      Manage Permissions
                    </button>
                    <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 inline-flex items-center transition-colors">
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