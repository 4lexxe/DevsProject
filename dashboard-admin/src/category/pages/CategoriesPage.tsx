import { useState, useMemo, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Filter,
  Tag,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  TrendingUp
} from 'lucide-react'
import {
  getAllCategories,
  deleteCategory,
  updateCategory,
  getCategoryStats,
  filterCategories
} from '../services/categoryService'
import type { Category, CategoryFilters, CategoryStats } from '../types/category.types'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useDebounce } from '../../dashboard/hooks/useDebounce'
import CategoryForm from '../components/CategoryForm'
import CategoryStatsCards from '../components/CategoryStatsCards'

const CategoriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const queryClient = useQueryClient()

  // Debounce del término de búsqueda
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Query para obtener todas las categorías
  const { data: allCategories = [], isLoading, error } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => getAllCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  })

  // Query para estadísticas
  const { data: stats } = useQuery({
    queryKey: ['category-stats'],
    queryFn: () => getCategoryStats(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })

  // Filtrado de categorías del lado del cliente
  const filteredCategories = useMemo(() => {
    const filters: CategoryFilters = {
      search: debouncedSearchTerm,
      status: filterStatus
    }
    return filterCategories(allCategories, filters)
  }, [allCategories, debouncedSearchTerm, filterStatus])

  // Mutación para eliminar categoría
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      toast.success('Categoría eliminada exitosamente')
      setShowDeleteConfirm(null)
    },
    onError: (error) => {
      console.error('Error al eliminar categoría:', error)
      toast.error('Error al eliminar la categoría')
    }
  })

  // Mutación para cambiar estado de categoría
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      updateCategory(id, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-categories'] })
      queryClient.invalidateQueries({ queryKey: ['category-stats'] })
      toast.success('Estado de categoría actualizado')
    },
    onError: (error) => {
      console.error('Error al cambiar estado:', error)
      toast.error('Error al cambiar el estado de la categoría')
    }
  })

  // Handlers
  const handleEdit = useCallback((category: Category) => {
    setEditingCategory(category)
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((categoryId: number) => {
    setShowDeleteConfirm(categoryId)
  }, [])

  const confirmDelete = useCallback(() => {
    if (showDeleteConfirm) {
      deleteMutation.mutate(showDeleteConfirm)
    }
  }, [showDeleteConfirm, deleteMutation])

  const handleToggleStatus = useCallback((categoryId: number, currentStatus: boolean) => {
    toggleStatusMutation.mutate({ id: categoryId, isActive: !currentStatus })
  }, [toggleStatusMutation])

  const handleFormSuccess = useCallback(() => {
    setShowForm(false)
    setEditingCategory(null)
    queryClient.invalidateQueries({ queryKey: ['all-categories'] })
    queryClient.invalidateQueries({ queryKey: ['category-stats'] })
  }, [queryClient])

  const handleFormCancel = useCallback(() => {
    setShowForm(false)
    setEditingCategory(null)
  }, [])

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error al cargar las categorías</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="h-6 w-6" />
            Gestión de Categorías
          </h1>
          <p className="text-gray-600 mt-1">
            Administra las categorías de cursos del sistema
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Estadísticas */}
      {stats && <CategoryStatsCards stats={stats} />}

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtro por estado */}
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de categorías */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Categorías ({filteredCategories.length})
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay categorías</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron categorías con los filtros aplicados.'
                : 'Comienza creando tu primera categoría.'}
            </p>
            {(!searchTerm && filterStatus === 'all') && (
              <div className="mt-6">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Categoría
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cursos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 text-lg">{category.icon}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {category.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
                        {category.coursesCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(category.id, category.isActive)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          category.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        disabled={toggleStatusMutation.isPending}
                      >
                        {category.isActive ? (
                          <>
                            <ToggleRight className="h-3 w-3 mr-1" />
                            Activa
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-3 w-3 mr-1" />
                            Inactiva
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                          title="Editar categoría"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              ¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  )
}

export default CategoriesPage