import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { getCourses, deleteCourse } from '../services/courseServices'
import FontelloIcon from '../../shared/components/icons/FontelloIcon'

interface Category {
  id: string
  name: string
  image?: string
  description: string
  isActive: boolean
}

interface CareerType {
  id: string
  name: string
  description: string
  isActive: boolean
}

interface Course {
  id: number
  slug?: string
  title: string
  image: string
  summary: string
  categories: Category[]
  about: string
  careerType: CareerType
  prerequisites: string[]
  learningOutcomes: string[]
  isActive: boolean
  isInDevelopment: boolean
  adminId: number
  createdAt: string
  studentsCount?: number
  duration?: number
  creator?: {
    id: number
    name: string
    username?: string
    avatar?: string
  } | null
}

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null)
  const queryClient = useQueryClient()

  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: getCourses,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard-courses'] })
      toast.success('Curso eliminado exitosamente')
      setDeleteConfirm(null)
    },
    onError: (error) => {
      console.error('Error al eliminar:', error)
      toast.error('Error al eliminar el curso')
      setDeleteConfirm(null)
    }
  })

  const handleDelete = async (courseId: string, courseName: string) => {
    setDeleteConfirm({ id: courseId, name: courseName })
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id)
    }
  }

  const filteredCourses = courses?.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.summary?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && course.isActive && !course.isInDevelopment) ||
                         (filterStatus === 'draft' && course.isInDevelopment) ||
                         (filterStatus === 'inactive' && !course.isActive)
    return matchesSearch && matchesFilter
  })

  const totalCourses = courses?.length || 0
  const totalStudents = courses?.reduce((total: number, course: Course) => total + (course.studentsCount || 0), 0) || 0
  const activeCourses = courses?.filter((course: Course) => course.isActive && !course.isInDevelopment).length || 0
  const draftCourses = courses?.filter((course: Course) => course.isInDevelopment).length || 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FontelloIcon
            name="icon-spin6"
            className="text-2xl text-gray-600 dark:text-gray-400 animate-spin"
            fallback={
              <div className="h-8 w-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            }
          />
          <p className="text-gray-600 dark:text-gray-400">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-900/30 rounded-lg p-6 shadow-sm max-w-md">
          <div className="flex items-start gap-3">
            <FontelloIcon name="icon-attention" className="text-lg text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Error</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Error al cargar los cursos</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <FontelloIcon
                    name="icon-book"
                    className="text-xl text-gray-700 dark:text-gray-300"
                    fallback={
                      <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    }
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    Gestión de Cursos
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Administra todos los cursos de la plataforma
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/courses/discount-events"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                >
                  <FontelloIcon name="icon-tag" className="text-sm" />
                  Descuentos
                </Link>
                <Link
                  to="/courses/new"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm"
                >
                  <FontelloIcon name="icon-plus" className="text-sm" />
                  Nuevo Curso
                </Link>
              </div>
            </div>

            {/* Minimalista Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg px-6 py-3 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-2">
                <FontelloIcon name="icon-book" className="text-xs" />
                <span className="font-medium text-gray-900 dark:text-white">{totalCourses}</span>
                <span>Total</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <FontelloIcon name="icon-users" className="text-xs" />
                <span className="font-medium text-gray-900 dark:text-white">{totalStudents}</span>
                <span>Estudiantes</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <FontelloIcon name="icon-check" className="text-xs text-green-600" />
                <span className="font-medium text-gray-900 dark:text-white">{activeCourses}</span>
                <span>Activos</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <FontelloIcon name="icon-edit" className="text-xs text-yellow-600" />
                <span className="font-medium text-gray-900 dark:text-white">{draftCourses}</span>
                <span>Borrador</span>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <FontelloIcon
                  name="icon-search"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                />
                <input
                  type="text"
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                />
              </div>
              <div className="flex items-center gap-2">
                <FontelloIcon name="icon-filter" className="text-gray-400 text-sm" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="draft">Borrador</option>
                  <option value="inactive">Inactivos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          {filteredCourses?.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <FontelloIcon name="icon-book" className="text-3xl text-gray-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                  {searchTerm || filterStatus !== 'all' ? 'No se encontraron cursos' : 'No hay cursos disponibles'}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Intenta con otros términos de búsqueda o filtros'
                    : 'Comienza creando tu primer curso'}
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Link
                    to="/courses/new"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                  >
                    <FontelloIcon name="icon-plus" className="text-sm" />
                    Nuevo Curso
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredCourses?.map((course: Course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
                  >
                    {/* Course Image */}
                    {course.image && (
                      <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <Link to={`/courses/${course.slug || course.id}`}>
                          <img
                            src={course.image}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </Link>
                        <div className="absolute top-2 right-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            (course.isActive && !course.isInDevelopment)
                              ? 'bg-green-500/90 text-white'
                              : course.isInDevelopment
                              ? 'bg-yellow-500/90 text-white'
                              : 'bg-gray-500/90 text-white'
                          }`}>
                            {(course.isActive && !course.isInDevelopment) ? 'Activo' : 
                             course.isInDevelopment ? 'Borrador' : 'Inactivo'}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      {/* Title */}
                      <Link to={`/courses/${course.slug || course.id}`}>
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors cursor-pointer">
                          {course.title}
                        </h3>
                      </Link>
                      
                      {/* Summary */}
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                        {course.summary}
                      </p>

                      {/* Minimal Info */}
                      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-3">
                        <div className="flex items-center gap-3">
                          {course.studentsCount !== undefined && (
                            <span>{course.studentsCount} estudiantes</span>
                          )}
                          {course.duration && (
                            <span>{course.duration}h</span>
                          )}
                        </div>
                        {course.categories && course.categories.length > 0 && (
                          <span className="text-gray-400 dark:text-gray-500">
                            {course.categories.length} {course.categories.length === 1 ? 'categoría' : 'categorías'}
                          </span>
                        )}
                      </div>

                      {/* Creator section */}
                      {course.creator && (
                        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                          {course.creator.avatar ? (
                            <img
                              src={course.creator.avatar}
                              alt={course.creator.name}
                              className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold border-2 border-gray-200 dark:border-gray-600">
                              {course.creator.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {course.creator.name}
                          </span>
                        </div>
                      )}

                      {/* Minimal Actions */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <Link
                          to={`/courses/${course.slug || course.id}`}
                          className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors py-1.5"
                        >
                          Ver
                        </Link>
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                        <Link
                          to={`/courses/${course.slug || course.id}/edit`}
                          className="flex-1 text-center text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors py-1.5"
                        >
                          Editar
                        </Link>
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(course.id.toString(), course.title);
                          }}
                          className="flex-1 text-center text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors py-1.5"
                          disabled={deleteMutation.isPending}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FontelloIcon name="icon-attention" className="text-xl text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Confirmar eliminación
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ¿Estás seguro de que quieres eliminar el curso <strong>"{deleteConfirm.name}"</strong>? Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CoursesPage
