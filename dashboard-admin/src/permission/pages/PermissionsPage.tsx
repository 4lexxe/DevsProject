import React from 'react';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import PermissionCRUD from '../components/PermissionCRUD';

const PermissionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <FontelloIcon
                  name="icon-key"
                  className="text-xl text-gray-700 dark:text-gray-300"
                  fallback={
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  }
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Gestión de Permisos
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Administra los permisos del sistema
                </p>
              </div>
            </div>
          </div>
          
          <PermissionCRUD />
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
