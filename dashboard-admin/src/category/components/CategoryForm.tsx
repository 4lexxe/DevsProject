import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Save, Tag, FileText, Eye, EyeOff } from 'lucide-react'
import { createCategory, updateCategory } from '../services/categoryService'
import { categorySchema } from '../validations/categorySchema'
import type { Category, CategoryFormData } from '../types/category.types'
import toast from 'react-hot-toast'

interface CategoryFormProps {
  category?: Category | null
  onSuccess: () => void
  onCancel: () => void
}

const CategoryForm = ({ category, onSuccess, onCancel }: CategoryFormProps) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    icon: '',
    description: '',
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const queryClient = useQueryClient()

  const isEditing = !!category

  // Llenar formulario si estamos editando
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        icon: category.icon,
        description: category.description,
        isActive: category.isActive
      })
    }
  }, [category])

  // Mutación para crear categoría
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      toast.success('Categoría creada exitosamente')
      onSuccess()
    },
    onError: (error) => {
      console.error('Error al crear categoría:', error)
      toast.error('Error al crear la categoría')
    }
  })

  // Mutación para actualizar categoría
  const updateMutation = useMutation({
    mutationFn: (data: CategoryFormData) => updateCategory(category!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      toast.success('Categoría actualizada exitosamente')
      onSuccess()
    },
    onError: (error) => {
      console.error('Error al actualizar categoría:', error)
      toast.error('Error al actualizar la categoría')
    }
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }))

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    try {
      categorySchema.parse(formData)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      if (error.errors) {
        error.errors.forEach((err: any) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message
          }
        })
      }
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario')
      return
    }

    if (isEditing) {
      updateMutation.mutate(formData)
    } else {
      createMutation.mutate(formData)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  // Lista de iconos comunes para categorías
  const commonIcons = [
    '💻', '🎨', '📊', '🔧', '📱', '🌐', '🎵', '📚', '🏃‍♂️', '🍳',
    '📸', '🎬', '✍️', '🔬', '💼', '🎯', '🌱', '🏠', '🚗', '✈️'
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Tag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-sm text-gray-500">
                {isEditing ? 'Modifica los datos de la categoría' : 'Crea una nueva categoría para los cursos'}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la categoría *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Desarrollo Web, Diseño Gráfico, Marketing..."
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Ícono */}
          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-2">
              Ícono de la categoría *
            </label>
            <div className="space-y-3">
              <input
                type="text"
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.icon ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: 💻, 🎨, 📊..."
              />
              
              {/* Iconos sugeridos */}
              <div>
                <p className="text-xs text-gray-500 mb-2">Iconos sugeridos:</p>
                <div className="flex flex-wrap gap-2">
                  {commonIcons.map((icon, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center text-lg hover:bg-gray-50 transition-colors ${
                        formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {errors.icon && (
              <p className="mt-1 text-sm text-red-600">{errors.icon}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe qué tipo de cursos incluye esta categoría..."
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-sm text-red-600">{errors.description}</p>
              ) : (
                <p className="text-xs text-gray-500">
                  Mínimo 10 caracteres, máximo 500
                </p>
              )}
              <p className="text-xs text-gray-400">
                {formData.description.length}/500
              </p>
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                Categoría activa
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1 ml-7">
              Las categorías activas son visibles para los usuarios
            </p>
          </div>

          {/* Vista previa */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Vista previa
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            
            {showPreview && (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-xl">
                      {formData.icon || '❓'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {formData.name || 'Nombre de la categoría'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {formData.description || 'Descripción de la categoría'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        formData.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {formData.isActive ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEditing ? 'Actualizar' : 'Crear'} Categoría
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CategoryForm