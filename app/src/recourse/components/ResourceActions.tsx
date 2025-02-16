import React from 'react';
import { Link } from 'react-router-dom';
import { Share2, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ResourceActionsProps {
  resourceId: number;
  onShare: () => void;
}

const ResourceActions: React.FC<ResourceActionsProps> = ({ resourceId, onShare }) => {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
      <div className="flex flex-wrap gap-3">
        <button
          onClick={onShare}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Compartir
        </button>
        <Link
          to={`/resources/${resourceId}/edit`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Link>
        <button
          onClick={() => toast.error('Función no implementada')}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default ResourceActions;