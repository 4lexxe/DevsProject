import React, { useState } from 'react';
import AddResourceButton from '../components/AddResourceButton';
import { AlertCircle } from 'lucide-react'; // Importamos el ícono de Lucide

const ResourceListHeader: React.FC = () => {
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-8">
      {/* Contenedor Principal */}
      <div className="flex w-full justify-between items-center">
        {/* Título Principal */}
        <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          Recursos Educativos
        </h1>

        {/* Contenedor de Ícono de Advertencia y Botón Agregar Recurso */}
        <div className="flex items-center gap-4">
          {/* Ícono de Advertencia */}
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setIsModalOpen(true)}
            onMouseLeave={() => setIsModalOpen(false)}
          >
            <AlertCircle className="w-5 h-5 text-gray-500" />
            {/* Modal de Advertencia */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* Fondo oscuro */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50"
                  onClick={() => setIsModalOpen(false)} // Cerrar al hacer clic fuera
                ></div>
                {/* Contenido del modal */}
                <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-sm w-full z-10">
                  <p className="text-gray-700">
                    <strong>Recuerda:</strong> Respeta la comunidad de recursos. La publicación de contenido inapropiado o fuera de lugar puede resultar en la suspensión permanente de tu cuenta.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Botón para Agregar Recurso */}
          <AddResourceButton />
        </div>
      </div>
    </div>
  );
};

export default ResourceListHeader;