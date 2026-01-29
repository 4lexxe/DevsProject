import React from 'react';
import FontelloIcon from '../../shared/components/icons/FontelloIcon';
import CareerTypeCRUD from '../components/careerType/CareerTypeCRUD';

const CareerTypesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <FontelloIcon
                  name="icon-briefcase"
                  className="text-xl text-gray-700 dark:text-gray-300"
                  fallback={
                    <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Gestión de Tipos de Carrera
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Administra los tipos de carrera del sistema
                </p>
              </div>
            </div>
          </div>
          
          <CareerTypeCRUD />
        </div>
      </div>
    </div>
  );
};

export default CareerTypesPage;
