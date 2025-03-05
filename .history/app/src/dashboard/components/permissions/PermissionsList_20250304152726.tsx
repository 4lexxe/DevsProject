import React, { useState } from 'react';
import { Shield, User, UserCheck, UserX, Check, X, Search, Filter } from 'lucide-react';

interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface UserPermission {
  id: number;
  userName: string;
  email: string;
  role: string;
  permissions: Permission[];
  blockedPermissions: Permission[];
}

interface PermissionsListProps {
  userPermissions: UserPermission[];
  onGrantPermission: (userId: number, permissionId: number) => void;
  onRevokePermission: (userId: number, permissionId: number) => void;
  onBlockPermission: (userId: number, permissionId: number) => void;
  onUnblockPermission: (userId: number, permissionId: number) => void;
}

const PermissionsList: React.FC<PermissionsListProps> = ({
  userPermissions,
  onGrantPermission,
  onRevokePermission,
  onBlockPermission,
  onUnblockPermission
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Extraer categorías únicas de permisos
  const allCategories = Array.from(
    new Set(
      userPermissions
        .flatMap(user => user.permissions)
        .map(permission => permission.category)
    )
  );

  // Filtrar usuarios por término de búsqueda
  const filteredUserPermissions = userPermissions.filter(user =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Alternar la expansión de un usuario
  const toggleUserExpanded = (userId: number) => {
    setExpandedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  // Verificar si un usuario tiene determinado permiso
  const hasPermission = (user: UserPermission, permissionId: number) => {
    return user.permissions.some(p => p.id === permissionId);
  };

  // Verificar si un permiso está bloqueado para un usuario
  const isPermissionBlocked = (user: UserPermission, permissionId: number) => {
    return user.blockedPermissions.some(p => p.id === permissionId);
  };

  // Obtener todas las categorías disponibles
  const categories = ['all', ...allCategories];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">User Permissions Management</h2>
        
        {/* Filtros y búsqueda */}
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Lista de usuarios con permisos */}
        <div className="mt-6 space-y-6">
          {filteredUserPermissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <p>No users match your search criteria.</p>
            </div>
          ) : (
            filteredUserPermissions.map(user => (
              <div key={user.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Cabecera del usuario */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer bg-gray-50 hover:bg-gray-100"
                  onClick={() => toggleUserExpanded(user.id)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-4">
                      {user.role}
                    </span>
                    <button 
                      type="button"
                      className="p-1 rounded-md hover:bg-gray-200"
                    >
                      {expandedUsers.includes(user.id) ? (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Contenido expandible - Permisos del usuario */}
                {expandedUsers.includes(user.id) && (
                  <div className="p-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Permissions</h3>
                    
                    {/* Tabla de permisos */}
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Permission
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {user.permissions.concat(user.blockedPermissions)
                            .filter((permission, index, self) => 
                              index === self.findIndex(p => p.id === permission.id) && 
                              (selectedCategory === 'all' || permission.category === selectedCategory)
                            )
                            .map(permission => {
                              const hasAccess = hasPermission(user, permission.id);
                              const isBlocked = isPermissionBlocked(user, permission.id);
                              
                              return (
                                <tr key={permission.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="font-medium text-gray-900">{permission.name}</div>
                                    <div className="text-gray-500">{permission.description}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {permission.category}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {isBlocked ? (
                                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Blocked
                                      </span>
                                    ) : hasAccess ? (
                                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Granted
                                      </span>
                                    ) : (
                                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        Not granted
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {isBlocked ? (
                                      <button
                                        onClick={() => onUnblockPermission(user.id, permission.id)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                      >
                                        Unblock
                                      </button>
                                    ) : hasAccess ? (
                                      <>
                                        <button
                                          onClick={() => onRevokePermission(user.id, permission.id)}
                                          className="text-red-600 hover:text-red-900 mr-3"
                                        >
                                          Revoke
                                        </button>
                                        <button
                                          onClick={() => onBlockPermission(user.id, permission.id)}
                                          className="text-gray-600 hover:text-gray-900"
                                        >
                                          Block
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        onClick={() => onGrantPermission(user.id, permission.id)}
                                        className="text-green-600 hover:text-green-900"
                                      >
                                        Grant
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsList;
