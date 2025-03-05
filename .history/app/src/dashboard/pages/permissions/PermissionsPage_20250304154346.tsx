import React, { useState } from 'react';

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Permissions</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add New User
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="role-filter" className="font-medium">Filter by Role:</label>
          <select 
            id="role-filter"
            className="border border-gray-300 rounded-md px-3 py-2"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
            <option value="privileged">Privileged</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as User['role'])}
                    className="border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="privileged">Privileged</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleStatusChange(
                      user.id, 
                      user.status === 'active' ? 'inactive' : 'active'
                    )}
                    className={`px-3 py-1 rounded-md ${
                      user.status === 'active' 
                        ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {user.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-1">{permission.name}</h3>
              <p className="text-sm text-gray-600">{permission.description}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id={`admin-${permission.id}`} className="mr-2" defaultChecked />
                  <label htmlFor={`admin-${permission.id}`}>Admin</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id={`superadmin-${permission.id}`} className="mr-2" defaultChecked />
                  <label htmlFor={`superadmin-${permission.id}`}>Super Admin</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id={`privileged-${permission.id}`} className="mr-2" defaultChecked={permission.id !== 1} />
                  <label htmlFor={`privileged-${permission.id}`}>Privileged</label>
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
