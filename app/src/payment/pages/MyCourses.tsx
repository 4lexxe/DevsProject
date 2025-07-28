"use client"

import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Play, CheckCircle, Download, Clock, Award, GraduationCap, ArrowLeft } from "lucide-react"
import { courseService } from "../services"
import type { UserCourse } from "../services/courseService"
import { useAuth } from "@/user/contexts/AuthContext";

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<UserCourse[]>([])
  const [coursesLoading, setCoursesLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (user) {
      loadUserCourses()
    }
  }, [user])

  const loadUserCourses = async () => {
    if (!user) return
    
    try {
      const userCourses = await courseService.getUserCourses(user.id.toString())
      setCourses(userCourses)
    } catch (error) {
      console.error('Error loading user courses:', error)
    } finally {
      setCoursesLoading(false)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "#16a34a" // Green for completed
    if (progress >= 70) return "#eab308" // Yellow for almost complete
    if (progress >= 30) return "#f97316" // Orange for in progress
    return "#6b7280" // Gray for just started
  }

  const getStatusBadge = (progress: number) => {
    if (progress >= 100) {
      return {
        text: "Completado",
        icon: <CheckCircle className="h-4 w-4" />,
        style: {
          backgroundColor: "#dcfce7",
          color: "#166534",
          border: "1px solid #bbf7d0"
        }
      }
    }
    if (progress > 0) {
      return {
        text: "En progreso",
        icon: <Clock className="h-4 w-4" />,
        style: {
          backgroundColor: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fde68a"
        }
      }
    }
    return {
      text: "No iniciado",
      icon: <Play className="h-4 w-4" />,
      style: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "1px solid #d1d5db"
      }
    }
  }

  const downloadCertificate = async (courseId: number) => {
    try {
      // Simular descarga de certificado (implementar según necesidades)
      const response = await fetch(`/api/courses/${courseId}/certificate`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificado-curso-${courseId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    }
  }

  // Verificaciones condicionales después de todos los hooks
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (coursesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Cargando tus cursos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:opacity-80 transition-opacity"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Cursos</h1>
          <p className="text-gray-600">Continúa tu aprendizaje donde lo dejaste</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border-2 rounded-lg shadow-sm bg-white" style={{ borderColor: "#42d7c7" }}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#1d4ed8" }}>
                {courses.length}
              </div>
              <div className="text-sm text-gray-600">Cursos Totales</div>
            </div>
          </div>

          <div className="border-2 rounded-lg shadow-sm bg-white" style={{ borderColor: "#42d7c7" }}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#16a34a" }}>
                {courses.filter(course => course.progress >= 100).length}
              </div>
              <div className="text-sm text-gray-600">Completados</div>
            </div>
          </div>

          <div className="border-2 rounded-lg shadow-sm bg-white" style={{ borderColor: "#42d7c7" }}>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold mb-2" style={{ color: "#f97316" }}>
                {courses.filter(course => course.progress > 0 && course.progress < 100).length}
              </div>
              <div className="text-sm text-gray-600">En Progreso</div>
            </div>
          </div>
        </div>

        {/* Lista de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const statusBadge = getStatusBadge(course.progress)
            
            return (
              <div
                key={course.id}
                className="border-2 rounded-lg shadow-sm bg-white transition-shadow hover:shadow-lg overflow-hidden"
                style={{ borderColor: "#42d7c7" }}
              >
                {/* Imagen del curso */}
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center" style={{ backgroundColor: "#e0f2fe" }}>
                    <GraduationCap className="h-16 w-16" style={{ color: "#1d4ed8" }} />
                  </div>
                )}

                {/* Contenido del curso */}
                <div className="p-6">
                  {/* Header con título y badge */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <Link className="font-bold text-lg text-gray-900 line-clamp-2" to={`/my-course/${course.id}`}>
                        {course.title}
                      </Link>
                      <span 
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
                        style={statusBadge.style}
                      >
                        {statusBadge.icon}
                        {statusBadge.text}
                      </span>
                    </div>
                    
                    {course.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                  </div>

                  {/* Progreso */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso</span>
                      <span className="text-sm font-medium" style={{ color: getProgressColor(course.progress) }}>
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${course.progress}%`,
                          backgroundColor: getProgressColor(course.progress)
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Play className="h-4 w-4" />
                      <span>Lecciones</span>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <Link
                      to={`/my-course/${course.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-white font-medium transition-colors"
                      style={{ backgroundColor: "#1d4ed8" }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                    >
                      <Play className="h-4 w-4" />
                      {course.progress > 0 ? 'Continuar' : 'Comenzar'}
                    </Link>

                    {course.progress >= 100 && (
                      <button
                        onClick={() => downloadCertificate(course.id)}
                        className="flex items-center justify-center p-2 rounded-md border transition-colors"
                        style={{ 
                          borderColor: "#d1d5db",
                          color: "#374151"
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#f3f4f6"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent"
                        }}
                        title="Descargar certificado"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Fecha de acceso */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Acceso concedido el {new Date(course.grantedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Estado vacío */}
        {courses.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No tienes cursos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Explora nuestro catálogo y comienza tu journey de aprendizaje
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-white font-medium transition-colors"
              style={{ backgroundColor: "#1d4ed8" }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1e40af"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            >
              <Award className="h-5 w-5" />
              Explorar Cursos
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
