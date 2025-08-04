"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock } from "lucide-react"
import { getSectionByIdWithContents } from "../services/sectionServices"
import { deleteContentQuiz } from "../services/contentServices"
import { Section as SectionType } from "../interfaces/ViewnerCourse"
import {
  SectionHeader,
  ContentItemDisplay,
  LoadingAndErrorStates
} from "../components/Section"

export default function SectionDetailPage() {
  const navigate = useNavigate()
  const params = useParams()
  const sectionId = params.id as string
  const [section, setSection] = useState<SectionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSection = async () => {
      if (!sectionId) return
      
      try {
        setLoading(true)
        setError(null)
        const sectionData = await getSectionByIdWithContents(sectionId)
        setSection(sectionData)
      } catch (err) {
        console.error('Error fetching section:', err)
        setError('Error al cargar la sección')
      } finally {
        setLoading(false)
      }
    }

    fetchSection()
  }, [sectionId])

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
        const sectionData = await getSectionByIdWithContents(sectionId)
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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <SectionHeader 
          section={section} 
          onBack={() => navigate("/")} 
        />

        {/* Contenidos de la sección */}
        <div className="rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight" style={{ color: "#0c154c" }}>
              <Clock className="h-5 w-5 inline-block mr-2" />
              Contenidos de la Sección ({section.contents.length})
            </h3>
          </div>
          <div className="p-6 pt-0">
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
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No hay contenidos configurados para esta sección.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
