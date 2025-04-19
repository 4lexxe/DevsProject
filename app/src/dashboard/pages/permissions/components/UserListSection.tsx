import React from 'react';
import { CheckIcon, XIcon, PencilIcon, RefreshCw, Search, FilterIcon } from 'lucide-react';
import { User } from '../types/permission.types';
import { Role as RoleType } from '@/profile/services/role.service';

interface UserListSectionProps {
  users: User[];
  filteredUsers: User[];
  roles: RoleType[];
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleRoleChange: (userId: number, roleId: number) => void;
  handleStatusChange: (userId: number, isActive: boolean) => void;
  handleOpenPermissionModal: (userId: number, username: string) => void;
  isLoading: boolean;
  roleOptions: { value: string; label: string }[];
}

const UserListSection: React.FC<UserListSectionProps> = ({
  users,
  filteredUsers,
  roles,
  selectedRole,
  setSelectedRole,
  searchQuery,
  setSearchQuery,
  handleRoleChange,
  handleStatusChange,
  handleOpenPermissionModal,
  isLoading,
  roleOptions
}) => {
  return (
    <>
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
                          {Array.isArray(roles) && roles.map((role) => (
                            <option key={role.id} value={role.id}>{role.name}</option>
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
    </>
  );
};

export default UserListSection;