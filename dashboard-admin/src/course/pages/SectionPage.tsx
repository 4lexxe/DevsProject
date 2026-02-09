"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useOutletContext } from "react-router-dom"
import { Clock, Plus } from "lucide-react"
import { getSectionByCourseAndSectionSlug, getSectionByIdWithContents, deleteSection } from "../services/sectionServices"
import { deleteContentQuiz } from "../services/contentServices"
import { Section as SectionType } from "../interfaces/ViewnerCourse"
import { CourseData } from "../interfaces/CourseDetail"
import {
  SectionHeader,
  ContentItemDisplay,
  LoadingAndErrorStates
} from "../components/Section"

interface CourseLayoutContext {
  course: CourseData;
  sections: SectionType[];
}

export default function SectionPage() {
  const navigate = useNavigate()
  const params = useParams<{ slug?: string; sectionSlug?: string; id?: string }>()
  const outletContext = useOutletContext<CourseLayoutContext>()
  
  const { slug, sectionSlug, id } = params
  const courseSlug = slug
  
  const [section, setSection] = useState<SectionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSection = async () => {
      // Si estamos dentro del CourseLayout, usar courseSlug y sectionSlug
      if (courseSlug && sectionSlug) {
        try {
          setLoading(true)
          setError(null)
          const sectionData = await getSectionByCourseAndSectionSlug(courseSlug, sectionSlug)
          setSection(sectionData)
        } catch (err) {
          console.error('Error fetching section:', err)
          setError('Error al cargar la sección')
        } finally {
          setLoading(false)
        }
      } 
      // Si es ruta antigua (sections/:id), intentar obtener y redirigir
      else if (id) {
        try {
          setLoading(true)
          const sectionData = await getSectionByIdWithContents(id)
          if (sectionData && sectionData.course) {
            const courseSlug = sectionData.course.slug || sectionData.course.id
            const sectionSlug = sectionData.slug || sectionData.id
            navigate(`/courses/${courseSlug}/section/${sectionSlug}`, { replace: true })
            return
          }
          setSection(sectionData)
        } catch (err) {
          console.error('Error fetching section:', err)
          setError('Error al cargar la sección')
        } finally {
          setLoading(false)
        }
      } else {
        setError('Parámetros inválidos')
        setLoading(false)
      }
    }

    fetchSection()
  }, [courseSlug, sectionSlug, id, navigate])

  // Quiz management functions
  const handleAddQuiz = (contentId: string) => {
    navigate(`/contents/${contentId}/quiz/new`)
  }

  const handleEditQuiz = (contentId: string) => {
    navigate(`/contents/${contentId}/quiz/edit`)
  }

  const handleDeleteQuiz = async (contentId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este quiz?')) {
      try {
        await deleteContentQuiz(contentId)
        // Refresh section data after deletion
        const sectionData = await getSectionByIdWithContents(sectionSlugOrId)
        setSection(sectionData)
      } catch (err) {
        console.error('Error deleting quiz:', err)
        setError('Error al eliminar el quiz')
      }
    }
  }

  // File management functions
  const handleUploadFiles = (contentId: string) => {
    // Aquí puedes abrir un modal para subir archivos
    // Por ahora solo navegamos a una página de gestión de archivos
    navigate(`/contents/${contentId}/files/upload`)
  }

  const handleManageFiles = (contentId: string) => {
    // Navegamos a la página de gestión de archivos del contenido
    navigate(`/contents/${contentId}/files`)
  }

  // Content management functions
  const handleEditContent = (contentId: string) => {
    if (courseSlug && sectionSlug) {
      navigate(`/courses/${courseSlug}/section/${sectionSlug}/content/${contentId}/edit`)
    } else if (section?.id) {
      navigate(`/courses/${section.courseId}/section/${section.id}/content/${contentId}/edit`)
    }
  }

  const handleAddContent = () => {
    if (courseSlug && sectionSlug) {
      navigate(`/courses/${courseSlug}/section/${sectionSlug}/content/new`)
    } else if (section?.id) {
      navigate(`/courses/${section.courseId}/section/${section.id}/content/new`)
    }
  }

  // Section management functions
  const handleDeleteSection = async (sectionId: number) => {
    const confirmMessage = `¿Estás seguro de que quieres eliminar esta sección completa?\n\n` +
      `Esto eliminará:\n` +
      `• La sección "${section?.title}"\n` +
      `• Todos sus contenidos (${section?.contents.length || 0} contenidos)\n` +
      `• Todos los archivos asociados\n` +
      `• Todas las carpetas de Google Drive\n\n` +
      `Esta acción NO SE PUEDE DESHACER.`

    if (window.confirm(confirmMessage)) {
      try {
        setLoading(true)
        await deleteSection(sectionId.toString())
        // Redirigir al curso después de eliminar
        if (courseSlug) {
          navigate(`/courses/${courseSlug}`)
        } else {
          navigate("/courses")
        }
      } catch (err) {
        console.error('Error deleting section:', err)
        setError('Error al eliminar la sección')
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (courseSlug) {
      navigate(`/courses/${courseSlug}`)
    } else {
      navigate("/courses")
    }
  }

  // Loading and error states
  if (loading || error || !section) {
    return (
      <LoadingAndErrorStates
        loading={loading}
        error={error}
        section={section}
        onNavigateHome={() => navigate("/")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader 
        section={section} 
        onBack={handleBack} 
        onDeleteSection={handleDeleteSection}
      />

      {/* Contenidos de la sección */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
            <Clock className="h-5 w-5 inline-block mr-2" />
            Contenidos de la Sección ({section.contents.length})
          </h3>
          <button
            onClick={handleAddContent}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md"
          >
            <Plus className="w-5 h-5" />
            Agregar Contenido
          </button>
        </div>
        <div className="p-6">
          {section.contents.length > 0 ? (
            <div className="space-y-4">
              {section.contents.map((content) => (
                <ContentItemDisplay
                  key={content.id}
                  content={content}
                  onAddQuiz={handleAddQuiz}
                  onEditQuiz={handleEditQuiz}
                  onDeleteQuiz={handleDeleteQuiz}
                  onUploadFiles={handleUploadFiles}
                  onManageFiles={handleManageFiles}
                  onEditContent={handleEditContent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 mb-4">No hay contenidos configurados para esta sección.</p>
              <button
                onClick={handleAddContent}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Agregar Primer Contenido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
