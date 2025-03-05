import React from 'react';
import { PlusIcon, XIcon, RefreshCw } from 'lucide-react';
import { Role as RoleType } from '@/profile/services/role.service';
import { User } from '../types/permission.types';
import { SYSTEM_ROLES, SYSTEM_ROLES_DESCRIPTIONS } from '../constants/roles.constants';

interface RoleListSectionProps {
  roles: RoleType[];
  users: User[];
  isLoadingRoles: boolean;
  handleCreateRole: () => void;
  handleEditRole: (role: RoleType) => void;
  handleDeleteRole: (roleId: number, roleName: string) => void;
}

const RoleListSection: React.FC<RoleListSectionProps> = ({
  roles,
  users,
  isLoadingRoles,
  handleCreateRole,
  handleEditRole,
  handleDeleteRole
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full mb-2">
            Control de Acceso
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Roles</h2>
          <p className="text-gray-500 text-sm">Administra los diferentes roles de acceso en el sistema</p>
        </div>
        <button 
          onClick={handleCreateRole}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Crear Rol
        </button>
      </div>
      
      {isLoadingRoles ? (
        <div className="flex justify-center items-center p-12">
          <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.isArray(roles) && roles.map((role: RoleType) => {
            // Verificar si es un rol del sistema según los nombres definidos en el backend
            const isSystemRole = SYSTEM_ROLES.includes(role.name.toLowerCase());
            const userCount = Array.isArray(users) ? users.filter(user => user.roleId === role.id).length : 0;
            // Obtener la descripción oficial del rol si es un rol del sistema
            const systemDescription = isSystemRole 
              ? SYSTEM_ROLES_DESCRIPTIONS[role.name.toLowerCase() as keyof typeof SYSTEM_ROLES_DESCRIPTIONS] 
              : null;
            
            return (
              <div 
                key={role.id} 
                className={`bg-white rounded-xl p-5 border ${isSystemRole ? 'border-blue-200' : 'border-gray-200'} shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 text-lg">{role.name}</h3>
                      {isSystemRole && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Sistema</span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-4">
                      {/* Usar la descripción oficial del sistema si está disponible */}
                      {systemDescription || role.description || `Rol de ${role.name}`}
                    </p>
                    
                    {Array.isArray(role.permissions) && (
                      <p className="text-xs text-gray-500">
                        {role.permissions.length} permisos asignados
                      </p>
                    )}
                    
                    <button 
                      onClick={() => handleEditRole(role)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-flex items-center"
                    >
                      {isSystemRole ? (
                        <>Ver detalles</>
                      ) : (
                        <>Editar rol</>
                      )}
                    </button>
                  </div>
                  {!isSystemRole && (
                    <button 
                      onClick={() => handleDeleteRole(role.id, role.name)}
                      className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar rol"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-1 rounded">
                    ID: {role.id}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-2">
                    Usuarios con este rol: <span className="font-medium">{userCount}</span>
                  </p>
                </div>
              </div>
            );
          })}
          
          {(!Array.isArray(roles) || roles.length === 0) && (
            <div className="col-span-3 text-center py-12 text-gray-500">
              No hay roles disponibles. Crea un nuevo rol haciendo clic en "Crear Rol".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleListSection;