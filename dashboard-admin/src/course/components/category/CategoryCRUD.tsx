import React, { useState, useEffect } from 'react';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  type Category,
  type CategoryCreateRequest
} from '../../services/categoryService';
import CategoryModal from './CategoryModal';
import CategoryList from './CategoryList';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';
import toast from 'react-hot-toast';

const CategoryCRUD: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar las categorías';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setCurrentCategory(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await deleteCategory(id);
      toast.success('Categoría eliminada exitosamente');
      await fetchCategories();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la categoría';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (categoryData: CategoryCreateRequest) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing && currentCategory?.id) {
        await updateCategory(currentCategory.id, categoryData);
        toast.success('Categoría actualizada exitosamente');
      } else {
        await createCategory(categoryData);
        toast.success('Categoría creada exitosamente');
      }

      await fetchCategories();
      setIsModalOpen(false);
      setCurrentCategory(null);
      setIsEditing(false);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Error al guardar la categoría';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentCategory(null);
    setIsEditing(false);
    setError(null);
  };

  if (loading && categories.length === 0) {
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
          <p className="text-gray-600 dark:text-gray-400">Cargando categorías...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
          </div>
        </div>
        <button
          onClick={handleCreate}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FontelloIcon
            name="icon-plus"
            className="text-base"
            fallback={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
          />
          Nueva Categoría
        </button>
      </div>

      {error && (
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <FontelloIcon
                name="icon-attention"
                className="text-lg text-red-600 dark:text-red-400"
                fallback={
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Error al procesar la solicitud</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialData={currentCategory}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        loading={loading}
      />
    </div>
  );
};

export default CategoryCRUD;
