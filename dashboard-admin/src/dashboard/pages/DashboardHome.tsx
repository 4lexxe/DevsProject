import { useQuery } from '@tanstack/react-query'
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  TrendingUp,
  Clock
} from 'lucide-react'
import { getCourses } from '../../course/services/courseServices'
import { getUserStats } from '../../user/services/userService'
import { Link } from 'react-router-dom'

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
  // Propiedades adicionales que podrían venir del backend
  studentsCount?: number
  status?: string
}

const DashboardHome = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: getCourses,
  })

  const { data: userStats } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
  })

  const stats = {
    totalCourses: courses?.length || 0,
    activeCourses: courses?.filter((course: Course) => course.isActive && !course.isInDevelopment).length || 0,
    totalStudents: userStats?.totalUsers || 0,
    draftCourses: courses?.filter((course: Course) => course.isInDevelopment).length || 0,
  }

  const recentCourses = courses?.slice(0, 5) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-gray-900">
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido al Dashboard!</h1>
        <p className="text-primary-100">
          Gestiona tu plataforma educativa desde aquí. Controla cursos, estudiantes y analíticas.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Cursos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link 
              to="/dashboard/courses" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Ver todos →
            </Link>
          </div>
        </div>

        

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cursos Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCourses}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {((stats.activeCourses / stats.totalCourses) * 100 || 0).toFixed(1)}% del total
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Borrador</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draftCourses}</p>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              Pendientes de publicar
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/courses/new"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <BookOpen className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Crear Nuevo Curso</p>
              <p className="text-sm text-gray-500">Añade un nuevo curso a la plataforma</p>
            </div>
          </Link>

          <Link
            to="/dashboard/analytics"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Ver Analíticas</p>
              <p className="text-sm text-gray-500">Revisa el rendimiento de tus cursos</p>
            </div>
          </Link>

          <Link
            to="/dashboard/students"
            className="flex items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <Users className="h-6 w-6 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Gestionar Estudiantes</p>
              <p className="text-sm text-gray-500">Administra los usuarios registrados</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Courses */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Cursos Recientes</h2>
          <Link 
            to="/dashboard/courses" 
            className="text-primary-600 hover:text-primary-800 text-sm font-medium"
          >
            Ver todos →
          </Link>
        </div>
        
        {recentCourses.length > 0 ? (
          <div className="space-y-3">
            {recentCourses.map((course: Course) => (
              <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-500">
                      {course.studentsCount || 0} estudiantes • {course.isActive && !course.isInDevelopment ? 'Activo' : 'Borrador'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/courses/${course.id}/edit`}
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay cursos todavía</h3>
            <p className="mt-1 text-sm text-gray-500">Comienza creando tu primer curso</p>
            <div className="mt-6">
              <Link
                to="/courses/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Crear Curso
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardHome
