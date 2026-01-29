import { useQuery } from '@tanstack/react-query'
import { getCourses } from '../../course/services/courseServices'
import { getUserStats, getAllUsers } from '../../user/services/userService'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StatsCard from '../components/StatsCard'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import DoughnutChart from '../components/DoughnutChart'
import AreaChart from '../components/AreaChart'
import MetricCard from '../components/MetricCard'
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
  status?: string
}

const DashboardHome = () => {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['dashboard-courses'],
    queryFn: getCourses,
  })

  interface UserStats {
    totalUsers: number;
  }

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
    retry: false,
  })

  // Obtener usuarios para el listado breve
  const { data: users = [] } = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: getAllUsers,
    retry: false,
  })

  const stats = {
    totalCourses: courses?.length || 0,
    activeCourses: courses?.filter((course: Course) => course.isActive && !course.isInDevelopment).length || 0,
    totalStudents: (userStats && typeof userStats.totalUsers === 'number') ? userStats.totalUsers : 0,
    draftCourses: courses?.filter((course: Course) => course.isInDevelopment).length || 0,
  }

  const recentCourses = courses?.slice(0, 5) || []

  // Datos para gráficas (simulados - en producción vendrían del backend)
  const enrollmentData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Nuevos Estudiantes',
        data: [12, 19, 15, 25, 22, 30, 28],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
      {
        label: 'Cursos Completados',
        data: [8, 15, 12, 18, 20, 25, 22],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      }
    ]
  }

  const revenueData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ingresos (ARS)',
        data: [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 82000, 79000, 88000],
        borderColor: 'rgb(139, 92, 246)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
      }
    ]
  }

  const coursePerformanceData = {
    labels: ['Desarrollo Web', 'Data Science', 'Diseño UI/UX', 'Marketing', 'Negocios'],
    datasets: [
      {
        label: 'Estudiantes Inscritos',
        data: [120, 95, 80, 65, 50],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 1,
      }
    ]
  }

  const courseStatusData = {
    labels: ['Activos', 'En Borrador', 'En Desarrollo'],
    datasets: [
      {
        label: 'Estado de Cursos',
        data: [
          stats.activeCourses,
          stats.draftCourses,
          courses?.filter((c: Course) => !c.isActive && !c.isInDevelopment).length || 0
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(16, 185, 129)',
          'rgb(251, 191, 36)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      }
    ]
  }

  const completionRateData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Tasa de Completación (%)',
        data: [65, 72, 68, 75, 80, 70, 78],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      }
    ]
  }

  const topCoursesData = {
    labels: ['Curso A', 'Curso B', 'Curso C', 'Curso D', 'Curso E'],
    datasets: [
      {
        label: 'Calificación Promedio',
        data: [4.8, 4.6, 4.7, 4.5, 4.4],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      }
    ]
  }

  const engagementData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Horas de Estudio',
        data: [1200, 1350, 1180, 1450, 1600, 1750],
        borderColor: 'rgb(251, 191, 36)',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        fill: true,
      },
      {
        label: 'Actividades Completadas',
        data: [450, 520, 480, 610, 680, 750],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
      }
    ]
  }

  // Calcular métricas adicionales
  const totalRevenue = 850000
  const avgCompletionRate = 72.5
  const avgRating = 4.6
  const activeUsers = 1250
  const newUsersThisMonth = 185
  const coursesCompleted = 320
  const avgStudyTime = 45 // minutos por sesión

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Analítico</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Vista completa de métricas y rendimiento</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
            <FontelloIcon 
              name="icon-download" 
              className="text-base"
              fallback={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              }
            />
            Exportar
          </button>
          <button className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center gap-2">
            <FontelloIcon 
              name="icon-plus" 
              className="text-base"
              fallback={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            />
            Nuevo Curso
          </button>
        </div>
      </motion.div>

      {/* Stats Cards Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Cursos"
          value={stats.totalCourses}
          iconName="icon-book"
          trend={{ value: 12, isPositive: true }}
          subtitle={`${stats.activeCourses} activos`}
        />
        <StatsCard
          title="Total Estudiantes"
          value={stats.totalStudents}
          iconName="icon-users"
          trend={{ value: 8, isPositive: true }}
          subtitle="Registrados"
        />
        <StatsCard
          title="Cursos Activos"
          value={stats.activeCourses}
          iconName="icon-up"
          trend={{ value: 5, isPositive: true }}
          subtitle={`${((stats.activeCourses / stats.totalCourses) * 100 || 0).toFixed(1)}% del total`}
        />
        <StatsCard
          title="En Borrador"
          value={stats.draftCourses}
          iconName="icon-clock"
          trend={{ value: 2, isPositive: false }}
          subtitle="Pendientes de publicar"
        />
      </div>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <MetricCard
          label="Ingresos Totales"
          value={`$${(totalRevenue / 1000).toFixed(0)}K`}
          change={{ value: 15.2, isPositive: true, period: 'mes anterior' }}
          icon="icon-money"
        />
        <MetricCard
          label="Tasa Completación"
          value={`${avgCompletionRate}%`}
          change={{ value: 3.5, isPositive: true, period: 'mes anterior' }}
          icon="icon-ok"
        />
        <MetricCard
          label="Calificación Promedio"
          value={avgRating.toFixed(1)}
          change={{ value: 0.2, isPositive: true, period: 'mes anterior' }}
          icon="icon-star"
        />
        <MetricCard
          label="Usuarios Activos"
          value={activeUsers}
          change={{ value: 8.3, isPositive: true, period: 'mes anterior' }}
          icon="icon-users"
        />
        <MetricCard
          label="Nuevos Usuarios"
          value={newUsersThisMonth}
          change={{ value: 12.1, isPositive: true, period: 'mes anterior' }}
          icon="icon-user-plus"
        />
        <MetricCard
          label="Cursos Completados"
          value={coursesCompleted}
          change={{ value: 5.7, isPositive: true, period: 'mes anterior' }}
          icon="icon-certificate"
        />
      </div>

      {/* Primera Fila de Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enrollment Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tendencias de Inscripción</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Últimos 7 meses</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <FontelloIcon
                  name="icon-up"
                  className="text-base text-green-600 dark:text-green-400"
                  fallback={
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  }
                />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">+12.5%</span>
              </div>
            </div>
          </div>
          <LineChart data={enrollmentData} height={300} />
        </motion.div>

        {/* Course Status Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors p-6"
        >
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Estado de Cursos</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribución actual</p>
          </div>
          <DoughnutChart data={courseStatusData} height={300} />
        </motion.div>
      </div>

      {/* Segunda Fila de Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ingresos Mensuales</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Últimos 12 meses</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg">
              <FontelloIcon
                name="icon-money"
                className="text-base text-purple-600"
                fallback={
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-4c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <span className="text-sm font-medium text-purple-600">+15.2%</span>
            </div>
          </div>
          <AreaChart data={revenueData} height={250} />
        </motion.div>

        {/* Completion Rate Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tasa de Completación Semanal</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Última semana</p>
            </div>
            <div className="text-2xl font-bold text-green-600">{avgCompletionRate}%</div>
          </div>
          <LineChart data={completionRateData} height={250} />
        </motion.div>
      </div>

      {/* Tercera Fila de Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Rendimiento por Categoría</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Estudiantes inscritos por categoría</p>
            </div>
          </div>
          <BarChart data={coursePerformanceData} height={300} />
        </motion.div>

        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Engagement de Estudiantes</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Horas de estudio y actividades</p>
            </div>
          </div>
          <AreaChart data={engagementData} height={300} />
        </motion.div>
      </div>

      {/* Top Courses Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top 5 Cursos por Calificación</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mejor valorados por estudiantes</p>
          </div>
        </div>
        <BarChart data={topCoursesData} height={250} />
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">Cursos Recientes</h2>
              <Link 
                to="/courses" 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Ver todos →
              </Link>
            </div>
          </div>
          
          {recentCourses.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentCourses.map((course: Course, index: number) => (
                <Link
                  key={course.id}
                  to={`/courses/${course.slug || course.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                >
                  {/* Imagen del curso */}
                  <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Contenido */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{course.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {course.studentsCount || 0} estudiantes
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                      <span className={`text-xs ${
                        course.isActive && !course.isInDevelopment 
                          ? 'text-gray-700 dark:text-gray-300' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {course.isActive && !course.isInDevelopment ? 'Activo' : 'Borrador'}
                      </span>
                    </div>
                  </div>
                  {/* Flecha */}
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="mx-auto h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">No hay cursos todavía</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Comienza creando tu primer curso</p>
              <Link
                to="/courses/new"
                className="inline-flex items-center px-3 py-1.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded text-xs font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors gap-1.5"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Curso
              </Link>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Acciones Rápidas</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <Link
              to="/courses/new"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Crear Nuevo Curso</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Añade un nuevo curso a la plataforma</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/dashboard/analytics"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Ver Analíticas</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Revisa el rendimiento de tus cursos</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link
              to="/students"
              className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Gestionar Estudiantes</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Administra los usuarios registrados</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Listados Compactos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cursos más Populares */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          {/* Header compacto */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Cursos más Populares</h3>
              <Link 
                to="/courses" 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Ver todos →
              </Link>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4">
            {courses && courses.length > 0 ? (
              <div className="space-y-3">
                {courses
                  .filter((c: Course) => c.studentsCount && c.studentsCount > 0)
                  .sort((a: Course, b: Course) => (b.studentsCount || 0) - (a.studentsCount || 0))
                  .slice(0, 3)
                  .map((course: Course, index: number) => {
                    const maxStudents = Math.max(...courses.map((c: Course) => c.studentsCount || 0))
                    const percentage = maxStudents > 0 ? ((course.studentsCount || 0) / maxStudents) * 100 : 0
                    
                    return (
                      <Link
                        key={course.id}
                        to={`/courses/${course.slug || course.id}`}
                        className="block group"
                      >
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors">
                          {/* Número de ranking */}
                          <div className="flex-shrink-0 h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                              {index + 1}
                            </span>
                          </div>
                          
                          {/* Imagen del curso */}
                          <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                            )}
                          </div>
                          
                          {/* Contenido */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                              {course.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gray-600 dark:bg-gray-400 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium flex-shrink-0">
                                {course.studentsCount || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                {courses.filter((c: Course) => c.studentsCount && c.studentsCount > 0).length === 0 && (
                  <div className="text-center py-6">
                    <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-gray-400">No hay cursos con estudiantes aún</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">No hay cursos disponibles</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Listado Compacto de Usuarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          {/* Header compacto */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Usuarios Recientes</h3>
              <Link 
                to="/students" 
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Ver todos →
              </Link>
            </div>
          </div>

          {/* Contenido compacto */}
          <div className="p-4">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {users && users.length > 0 ? (
                users.slice(0, 6).map((user: any) => (
                  <Link
                    key={user.id}
                    to={`/students/${user.id}`}
                    className="flex-shrink-0 w-36"
                  >
                    <div className="border border-gray-200 dark:border-gray-700 rounded overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                      {/* Imagen compacta */}
                      <div className="relative h-20 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || user.email}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.nextElementSibling) {
                                (target.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className={`absolute inset-0 bg-gray-200 dark:bg-gray-600 flex items-center justify-center ${user.avatar ? 'hidden' : 'flex'}`}
                        >
                          <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-500 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        {/* Badge neutro */}
                        {user.role && (
                          <div className="absolute top-1 right-1">
                            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-800 dark:bg-gray-200 text-gray-100 dark:text-gray-800">
                              {user.role.name}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Contenido compacto */}
                      <div className="p-2">
                        <h4 className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1 mb-0.5 leading-tight">
                          {user.name || user.displayName || 'Usuario'}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email || 'Sin email'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-gray-500 dark:text-gray-400 w-full">
                  <p>No hay usuarios disponibles</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default DashboardHome
