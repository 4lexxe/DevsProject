import React from 'react';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import RoleCRUD from '../components/RoleCRUD';

const RolesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <FontelloIcon
                  name="icon-shield"
                  className="text-xl text-gray-700 dark:text-gray-300"
                  fallback={
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  }
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Gestión de Roles
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Administra los roles y permisos del sistema
                </p>
              </div>
            </div>
          </div>
          
          {/* Componente CRUD */}
          <RoleCRUD />
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
