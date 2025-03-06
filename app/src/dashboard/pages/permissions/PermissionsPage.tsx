import React from 'react';
import { usePermissionsPage } from '@/dashboard/pages/permissions/hooks/usePermissions';
import UserListSection from '@/dashboard/pages/permissions/components/UserListSection';
import RoleListSection from '@/dashboard/pages/permissions/components/RolesListSection';
import PermissionModal from '@/dashboard/pages/permissions/components/PermissionModal';
import RoleModal from '@/dashboard/pages/permissions/components/RoleModal';

const PermissionsPage: React.FC = () => {
  const {
    users,
    roles,
    filteredUsers,
    selectedRole,
    setSelectedRole,
    selectedUser,
    selectedUsername,
    permissionModalOpen,
    setPermissionModalOpen,
    roleModalOpen,
    setRoleModalOpen,
    editingRole,
    searchQuery,
    setSearchQuery,
    isLoaded,
    isLoadingUsers,
    isLoadingRoles,
    handleRoleChange,
    handleStatusChange,
    handleOpenPermissionModal,
    handleSaveRole,
    handleEditRole,
    handleCreateRole,
    handleDeleteRole,
    roleOptions
  } = usePermissionsPage();

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
      </div>
      
      {/* User List Section */}
      <UserListSection 
        users={users}
        filteredUsers={filteredUsers}
        roles={roles}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleRoleChange={handleRoleChange}
        handleStatusChange={handleStatusChange}
        handleOpenPermissionModal={handleOpenPermissionModal}
        isLoading={isLoadingUsers}
        roleOptions={roleOptions}
      />
      
      {/* Role List Section */}
      <RoleListSection 
        roles={roles}
        users={users}
        isLoadingRoles={isLoadingRoles}
        handleCreateRole={handleCreateRole}
        handleEditRole={handleEditRole}
        handleDeleteRole={handleDeleteRole}
      />
      
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
        role={editingRole && {
          ...editingRole,
          permissions: editingRole.Permissions || []
        }}
        onSave={handleSaveRole}
        isLoading={false}
      />
    </div>
  );
};

export default PermissionsPage;