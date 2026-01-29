import React, { useState, useEffect } from 'react';
import { 
  getCareerTypes, 
  createCareerType, 
  updateCareerType, 
  deleteCareerType,
  type CareerType,
  type CareerTypeCreateRequest
} from '../../services/careerTypeService';
import CareerTypeModal from './CareerTypeModal';
import CareerTypeList from './CareerTypeList';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';

const CareerTypeCRUD: React.FC = () => {
  const [careerTypes, setCareerTypes] = useState<CareerType[]>([]);
  const [currentCareerType, setCurrentCareerType] = useState<CareerType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCareerTypes();
  }, []);

  const fetchCareerTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCareerTypes();
      setCareerTypes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los tipos de carrera';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentCareerType(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (careerType: CareerType) => {
    setCurrentCareerType(careerType);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteCareerType(id);
      toast.success('Tipo de carrera eliminado exitosamente');
      await fetchCareerTypes();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el tipo de carrera';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (careerTypeData: CareerTypeCreateRequest) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing && currentCareerType?.id) {
        await updateCareerType(currentCareerType.id, careerTypeData);
        toast.success('Tipo de carrera actualizado exitosamente');
      } else {
        await createCareerType(careerTypeData);
        toast.success('Tipo de carrera creado exitosamente');
      }

      await fetchCareerTypes();
      setIsModalOpen(false);
      setCurrentCareerType(null);
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al guardar el tipo de carrera';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCareerType(null);
    setIsEditing(false);
    setError(null);
  };

  if (loading && careerTypes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <FontelloIcon
            name="icon-spin6"
            className="text-2xl text-gray-600 dark:text-gray-400 animate-spin"
            fallback={
              <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            }
          />
          <p className="text-gray-600 dark:text-gray-400">Cargando tipos de carrera...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {careerTypes.length} {careerTypes.length === 1 ? 'tipo de carrera' : 'tipos de carrera'}
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontelloIcon name="icon-plus" className="text-base" />
          Nuevo Tipo de Carrera
        </button>
      </div>

      {error && (
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <FontelloIcon name="icon-attention" className="text-lg text-red-600 dark:text-red-400" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Error al procesar la solicitud</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      <CareerTypeList
        careerTypes={careerTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <CareerTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={currentCareerType}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        loading={loading}
      />
    </div>
  );
};

export default CareerTypeCRUD;
