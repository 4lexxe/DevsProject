import React, { useState, useEffect } from 'react';
import { XIcon, RefreshCw } from 'lucide-react';
import { RoleCreateRequest, RoleUpdateRequest, Permission, RoleModel } from '../types/permission.types';
import { SYSTEM_ROLES, SYSTEM_ROLES_DESCRIPTIONS } from '../constants/roles.constants';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: RoleModel | null;
  onSave: (role: RoleCreateRequest | RoleUpdateRequest) => void;
  isLoading: boolean;
}

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose, role, onSave, isLoading }) => {
  const [formData, setFormData] = useState<RoleCreateRequest | RoleUpdateRequest>({
    name: role?.name || '',
    description: role?.description || '',
    permissionIds: role?.permissions?.map((p: Permission) => p.id) || []
  });

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissionIds: role.permissions?.map((p: Permission) => p.id) || []
      });
    } else {
      // Reset form when creating a new role
      setFormData({
        name: '',
        description: '',
        permissionIds: []
      });
    }
  }, [role, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Verificar si el rol es un rol del sistema (no editable)
  const isSystemRole = role && SYSTEM_ROLES.includes(role.name.toLowerCase());

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-medium">
            {role ? `Rol: ${role.name}` : 'Crear Nuevo Rol'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
        
        {isSystemRole ? (
          <div key="system-role" className="p-6 space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Rol predefinido del sistema</span>
                    <br/>
                    Este es un rol esencial del sistema y no puede ser modificado. Su configuración está definida en el núcleo de la aplicación.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Rol
              </label>
              <input
                type="text"
                value={role.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={role.description || SYSTEM_ROLES_DESCRIPTIONS[role.name.toLowerCase() as keyof typeof SYSTEM_ROLES_DESCRIPTIONS] || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                rows={3}
                disabled
              />
            </div>
            
            {role.permissions && role.permissions.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permisos ({role.permissions.length})
                </label>
                <div className="max-h-[200px] overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {role.permissions.map((permission: Permission) => (
                      <div key={permission.id} className="text-xs bg-white p-2 border border-gray-100 rounded">
                        {permission.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form key="edit-role" onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Rol
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre del rol"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descripción del rol"
                rows={3}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                disabled={isLoading}
              >
                {isLoading && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                {role ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RoleModal;