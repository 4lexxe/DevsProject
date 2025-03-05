import React from 'react';
import { PlusIcon } from 'lucide-react';

interface PageHeaderProps {
  onCreateRole: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ onCreateRole }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Permisos</h1>
        <p className="mt-1 text-sm text-gray-500">
          Administra los roles y permisos de los usuarios del sistema
        </p>
      </div>
      <button
        onClick={onCreateRole}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Crear Rol
      </button>
    </div>
  );
}; 