import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Share2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../auth/contexts/AuthContext'; // Importa el hook useAuth
import { ResourceService } from '../services/resource.service';
import { createPortal } from 'react-dom';

interface ResourceActionsProps {
  resourceId: number;
  ownerId: number; // ID del propietario del recurso
  onShare: () => void;
}

const ResourceActions: React.FC<ResourceActionsProps> = ({ resourceId, ownerId, onShare }) => {
  const { user } = useAuth(); // Obtener el usuario autenticado desde el contexto
  const navigate = useNavigate();
  const isOwner = user?.id === ownerId;

  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = () => {
    if (!isOwner) {
      toast.error('No tienes permisos para editar este recurso');
      return;
    }
    navigate(`/resources/${resourceId}/edit`);
  };

  const handleDelete = async () => {
    try {
      await ResourceService.deleteResource(resourceId);
      toast.success('Recurso eliminado exitosamente');
      navigate('/recursos');
    } catch (error) {
      toast.error('Error al eliminar el recurso');
      console.error('Error:', error);
    }
  };

  // Renderizar el modal
  const renderModal = () => {
    return createPortal(
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* Contenedor del modal */}
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full sm:max-w-md mx-auto">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Eliminación</h3>
          <p className="text-sm text-gray-700 mb-6">
            ¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                setIsModalOpen(false); // Cerrar el modal
                await handleDelete(); // Ejecutar la eliminación
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex flex-wrap gap-3">
        {/* Botón Compartir */}
        <button
          onClick={onShare}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </button>

        {/* Botones para el propietario */}
        {isOwner && (
          <>
            {/* Botón Editar */}
            <Link
              to={`/resources/${resourceId}/edit`}
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Link>

            {/* Botón Eliminar */}
            <button
              onClick={() => setIsModalOpen(true)} // Abrir el modal
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </button>
          </>
        )}
      </div>

      {/* Mostrar el modal si está abierto */}
      {isModalOpen && renderModal()}
    </div>
  );
};

export default ResourceActions;