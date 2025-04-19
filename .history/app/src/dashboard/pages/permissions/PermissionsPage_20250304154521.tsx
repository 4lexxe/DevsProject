import React, { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon, XIcon, PencilIcon, FilterIcon } from 'lucide-react';

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

const PermissionsPage: React.FC = () => {
  // Datos de ejemplo
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'inactive' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'privileged', status: 'active' },
  ]);

  const [permissions, setPermissions] = useState<Permission[]>([
    { id: 1, name: 'Manage Users', description: 'Can view, create, edit, and delete users' },
    { id: 2, name: 'Manage Content', description: 'Can create, edit, and delete content' },
    { id: 3, name: 'View Reports', description: 'Can view analytics and reports' },
  ]);

  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simular retardo de carga para la animación
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = selectedRole === 'all' 
    ? users 
    : users.filter(user => user.role === selectedRole);

  const handleRoleChange = (userId: number, newRole: User['role']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleStatusChange = (userId: number, newStatus: User['status']) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
    { value: 'privileged', label: 'Privileged' },
  ];

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
              {filteredUsers.map((user) => (
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
        <div className="flex items-center mb-6">
          <div>
            <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mb-2">
              Access Control
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Role Permissions</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {permissions.map((permission) => (
            <div 
              key={permission.id} 
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
            >
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
