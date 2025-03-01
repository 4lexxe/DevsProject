import React from 'react';
import HeaderSectionCRUD from '../../components/admin/HeaderSectionCRUD';
import { LayoutGrid, ChevronLeft, Info } from 'lucide-react';

const HeaderSectionAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <a 
                href="/admin" 
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                <span className="text-sm font-medium">Volver al panel</span>
              </a>
            </div>
            
            <div className="flex items-center">
              <h1 className="text-lg font-bold text-gray-900 flex items-center">
                <LayoutGrid className="h-5 w-5 mr-2 text-blue-600" />
                Panel de Administración
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
          {/* Tarjeta de información */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Gestión de Secciones de Encabezado
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Desde aquí puedes crear, editar y eliminar las secciones que aparecen en el carrusel principal de la página de inicio.
                    Las imágenes deben tener un tamaño recomendado de 1920x1080 píxeles para una mejor visualización.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Componente CRUD */}
          <HeaderSectionCRUD />
        </div>
      </div>
      
      {/* Pie de página */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center">
            <p className="text-sm text-gray-500">
              Panel de administración &copy; {new Date().getFullYear()} - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeaderSectionAdminPage; 