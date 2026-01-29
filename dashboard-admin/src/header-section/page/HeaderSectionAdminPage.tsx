import React from 'react';
import HeaderSectionCRUD from '../components/HeaderSectionCRUD';
import { LayoutGrid, ChevronLeft } from 'lucide-react';

const HeaderSectionAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Barra superior */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a 
                href="/admin" 
                className="flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Volver al panel</span>
              </a>
            </div>
            
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <LayoutGrid className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Headers de la Página de Inicio
              </h1>
            </div>
            
            <div className="w-40">
              {/* Espacio reservado para mantener el centrado */}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeaderSectionCRUD />
        </div>
      </div>
      
      {/* Pie de página */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Panel de administración &copy; {new Date().getFullYear()} - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeaderSectionAdminPage;