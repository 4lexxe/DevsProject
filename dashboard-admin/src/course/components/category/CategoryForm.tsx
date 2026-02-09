import React, { useState, useEffect } from 'react';
import { type Category, type CategoryCreateRequest } from '../../services/categoryService';
import FontelloIcon from '../../../shared/components/icons/FontelloIcon';

interface CategoryFormProps {
  initialData: Category | null;
  onSubmit: (categoryData: CategoryCreateRequest) => void;
  onCancel: () => void;
  isEditing: boolean;
  loading: boolean;
}

const initialFormState: CategoryCreateRequest = {
  name: '',
  icon: '',
  description: '',
  isActive: true
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isEditing,
  loading
}) => {
  const [formData, setFormData] = useState<CategoryCreateRequest>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        icon: initialData.icon || '',
        description: initialData.description || '',
        isActive: initialData.isActive ?? true
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la categoría es obligatorio';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.name.length > 100) {
      newErrors.name = 'El nombre no debe exceder los 100 caracteres';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    } else if (formData.description.length < 5) {
      newErrors.description = 'La descripción debe tener al menos 5 caracteres';
    } else if (formData.description.length > 500) {
      newErrors.description = 'La descripción no debe exceder los 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">
              <FontelloIcon
                name="icon-folder"
                className="text-base text-gray-700 dark:text-gray-300"
                fallback={
                  <svg className="h-5 w-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                }
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {isEditing ? 'Modifica la información de la categoría' : 'Completa los datos para crear una nueva categoría'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            title="Cerrar"
          >
            <FontelloIcon
              name="icon-cancel"
              className="text-lg"
              fallback={
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-900 dark:text-white"
          >
            Nombre de la Categoría
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Ej: Desarrollo Web, Diseño, Marketing..."
            required
            className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 bg-white dark:bg-gray-700/50 dark:text-white dark:border-gray-600 ${
              errors.name
                ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="icon"
            className="block text-sm font-semibold text-gray-900 dark:text-white"
          >
            Icono (Emoji o código)
          </label>
          <input
            id="icon"
            name="icon"
            type="text"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            placeholder="Ej: , ,  o código de icono"
            className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 bg-white dark:bg-gray-700/50 dark:text-white hover:border-gray-400 dark:hover:border-gray-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Puedes usar un emoji o el nombre de un icono de Fontello
          </p>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-900 dark:text-white"
          >
            Descripción
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe qué tipo de cursos pertenecen a esta categoría..."
            rows={4}
            required
            className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 resize-none bg-white dark:bg-gray-700/50 dark:text-white dark:border-gray-600 ${
              errors.description
                ? 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium mt-1">{errors.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isActive"
            name="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => handleChange('isActive', e.target.checked)}
            className="h-4 w-4 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 rounded focus:ring-gray-900 dark:focus:ring-gray-100"
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-gray-900 dark:text-white"
          >
            Categoría activa
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 dark:text-gray-900 rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <FontelloIcon
                  name="icon-spin6"
                  className="text-base animate-spin"
                  fallback={
                    <div className="h-4 w-4 border-2 border-white dark:border-gray-900 border-t-transparent rounded-full animate-spin" />
                  }
                />
                {isEditing ? 'Guardando...' : 'Creando...'}
              </>
            ) : (
              <>
                <FontelloIcon
                  name="icon-floppy"
                  className="text-base"
                  fallback={
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                  }
                />
                {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
