import React, { useState } from 'react';
import { X, Save, Shield, AlertTriangle } from 'lucide-react';
import { mockPermissions } from '../../data/mockPermissionsData';

interface UserPermissionEditorProps {
  userId: number;
  userName: string;
  userEmail: string;
  currentRole: string;
  currentPermissions: string[];
  onClose: () => void;
  onSave: (userId: number, data: { role: string; permissions: string[] }) => void;
}

const UserPermissionEditor: React.FC<UserPermissionEditorProps> = ({
  userId,
  userName,
  userEmail,
  currentRole,
  currentPermissions,
  onClose,
  onSave,
}) => {
  const [role, setRole] = useState(currentRole);
  const [permissions, setPermissions] = useState<string[]>(currentPermissions);
  const [customPermissions, setCustomPermissions] = useState<boolean>(
    currentPermissions.some(p => !mockPermissions.find(mp => mp.id === p && mp.category === 'role-based'))
  );

  const handleRoleChange = (newRole: string) => {
    setRole(newRole);
    
    // Reset custom permissions when role changes
    if (!customPermissions) {
      const roleBasedPermissions = mockPermissions
        .filter(p => p.category === 'role-based' && p.name.toLowerCase().includes(newRole.toLowerCase()))
        .map(p => p.id);
      setPermissions(roleBasedPermissions);
    }
  };

  const handleTogglePermission = (permissionId: string) => {
    if (!customPermissions) return;
    
    setPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleToggleCustomPermissions = () => {
    const newValue = !customPermissions;
    setCustomPermissions(newValue);
    
    if (!newValue) {
      // Reset to role-based permissions only
      const roleBasedPermissions = mockPermissions
        .filter(p => p.category === 'role-based' && p.name.toLowerCase().includes(role.toLowerCase()))
        .map(p => p.id);
      setPermissions(roleBasedPermissions);
    }
  };

  const handleSave = () => {
    onSave(userId, { role, permissions });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Shield className="mr-2 h-5 w-5 text-blue-600" />
            Edit User Permissions
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          <div className="mb-6">
            <div className="flex items-start">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=random`} 
                alt={userName}
                className="h-12 w-12 rounded-full mr-4" 
              />
              <div>
                <h4 className="text-lg font-medium text-gray-900">{userName}</h4>
                <p className="text-sm text-gray-600">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="instructor">Instructor</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Permissions</label>
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-2"
                  checked={customPermissions}
                  onChange={handleToggleCustomPermissions}
                />
                Custom permissions
              </label>
            </div>
            
            <div className="mt-3 border rounded-md divide-y divide-gray-200">
              {mockPermissions.map((permission) => (
                <div 
                  key={permission.id} 
                  className={`flex items-center justify-between p-3 ${
                    customPermissions ? 'hover:bg-gray-50 cursor-pointer' : ''
                  }`}
                  onClick={() => handleTogglePermission(permission.id)}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                    <p className="text-xs text-gray-500">{permission.description}</p>
                  </div>
                  <div className="relative flex items-center">
                    {!customPermissions && permission.category === 'role-based' && 
                      permission.name.toLowerCase().includes(role.toLowerCase()) && (
                      <span className="text-xs text-gray-500 mr-2">Included with role</span>
                    )}
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={permissions.includes(permission.id)}
                      onChange={() => {}}
                      disabled={!customPermissions}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {customPermissions && (
            <div className="bg-yellow-50 p-4 rounded-md mb-6 flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3 flex-shrink-0" />
              <p className="text-sm text-yellow-700">
                Custom permissions override role-based permissions. 
                This user will have exactly the permissions you select, regardless of their role.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            className="mr-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionEditor;
