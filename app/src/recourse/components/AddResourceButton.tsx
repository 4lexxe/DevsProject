import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../auth/contexts/AuthContext'; // Importa el hook useAuth

const AddResourceButton: React.FC = () => {
  const { user } = useAuth(); // Obtiene el estado del usuario desde el contexto

  // Si el usuario no está autenticado, no se muestra el botón
  if (!user) {
    return null;
  }

  return (
    <Link
      to="/resources/create"
      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-700 hover:from-gray-800 hover:to-gray-600 text-white rounded-md transition-all duration-200 text-sm shadow-sm hover:shadow group"
    >
      <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
      Agregar Recurso
    </Link>
  );
};

export default AddResourceButton;