import React, { useState } from 'react';
import PermissionsList from './PermissionsList';
import RolesList from './RolesList';
import PermissionModal from './PermissionModal';
import { Plus } from 'lucide-react';

// Tipos
interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissionCount: number;
  userCount: number;
}

interface UserPermission {
  id: number;
  userName: string;
  email: string;
  role: string;
  permissions: Permission[];
  blockedPermissions: Permission[];
}

interface PermissionsManagerProps {
  userPermissions: UserPermission[];
  roles: Role[];
  availablePermissions: Permission[];
}

const PermissionsManager: React.FC<PermissionsManagerProps> = ({ 
  userPermissions, 
  roles, 
  availablePermissions 
}) => {
  const [activeTab, setActiveTab] = useState('users');
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | undefined>(undefined);

  // Handlers for permissions
  const handleGrantPermission = (userId: number, permissionId: number) => {
    console.log(`Granting permission ${permissionId} to user ${userId}`);
  };

  const handleRevokePermission = (userId: number, permissionId: number) => {
    console.log(`Revoking permission ${permissionId} from user ${userId}`);
  };

  const handleBlockPermission = (userId: number, permissionId: number) => {
    console.log(`Blocking permission ${permissionId} for user ${userId}`);
  };

  const handleUnblockPermission = (userId: number, permissionId: number) => {
    console.log(`Unblocking permission ${permissionId} for user ${userId}`);
  };

  // Handlers for roles
  const handleCreateRole = () => {
    console.log("Opening create role modal");
  };

  const handleEditRole = (role: Role) => {
    console.log(`Editing role: ${role.name}`);
  };

  const handleDeleteRole = (roleId: number) => {
    console.log(`Deleting role with ID: ${roleId}`);
  };

  // Handlers for permission management
  const handleCreatePermission = () => {
    setCurrentPermission(undefined);
    setIsPermissionModalOpen(true);
  };

  const handleEditPermission = (permission: Permission) => {
    setCurrentPermission(permission);
    setIsPermissionModalOpen(true);
  };

  const handleSavePermission = (permission: Omit<Permission, 'id'>) => {
    console.log('Saving permission:', permission);
    setIsPermissionModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`whitespace-nowrap pb-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Permissions
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`whitespace-nowrap pb-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'roles'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Roles
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`whitespace-nowrap pb-3 px-1 font-medium text-sm border-b-2 ${
              activeTab === 'permissions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Available Permissions
          </button>
        </nav>
      </div>
      
      {/* Contenido de las tabs */}
      <div>
        {activeTab === 'users' && (
          <PermissionsList 
            userPermissions={userPermissions}
            onGrantPermission={handleGrantPermission}
            onRevokePermission={handleRevokePermission}
            onBlockPermission={handleBlockPermission}
            onUnblockPermission={handleUnblockPermission}
          />
        )}
        
        {activeTab === 'roles' && (
          <RolesList 
            roles={roles}
            onEditRole={handleEditRole}
            onDeleteRole={handleDeleteRole}
            onCreateRole={handleCreateRole}
          />
        )}
        
        {activeTab === 'permissions' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Available Permissions</h2>
              <button 
                onClick={handleCreatePermission}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
              >
                <Plus size={16} className="mr-1" /> Add Permission
              </button>
            </div>
            
            {/* Lista de todos los permisos del sistema */}
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
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availablePermissions.map(permission => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {permission.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {permission.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditPermission(permission)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear/editar permisos */}
      <PermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onSave={handleSavePermission}
        permission={currentPermission}
        title={currentPermission ? "Edit Permission" : "Create Permission"}
      />
    </div>
  );
};

export default PermissionsManager;
