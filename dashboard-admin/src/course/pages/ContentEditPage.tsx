import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import SectionList from "../components/SectionForm/SectionList";
import {
  SectionProvider,
  useSectionContext,
} from "../context/SectionFormContext";
import { getSectionById } from "../services/sectionServices";
import { getContentById } from "../services/contentServices";
import { ISection } from "../interfaces/CourseForm";
import { IContent } from "../interfaces/Content";
import { CourseData } from "../interfaces/CourseDetail";

interface CourseLayoutContext {
  course: CourseData;
  sections: any[];
}

function ContentManager() {
  const { slug, sectionSlug, contentId } = useParams<{ 
    slug?: string; 
    sectionSlug?: string; 
    contentId?: string;
  }>();
  const { state: sectionState, setSection, editContent, addContent } = useSectionContext();
  const navigate = useNavigate();
  const { course } = useOutletContext<CourseLayoutContext>();
  const [sectionId, setSectionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadSectionAndContent = async () => {
      if (!sectionSlug || !slug) return;

      try {
        // Obtener la sección
        const section = await getSectionById(sectionSlug);
        // Guardar el ID numérico de la sección para usarlo al actualizar
        setSectionId(section.id?.toString() || sectionSlug);
        
        const transformedSection: ISection = {
          title: section.title,
          description: section.description,
          moduleType: section.moduleType,
          coverImage: section.coverImage,
          colorGradient: section.colorGradient,
          contents: section.contents.map((content: IContent) => ({
            id: content.id,
            title: content.title,
            text: content.text,
            markdown: content.markdown,
            quiz:
              content.quiz && typeof content.quiz === "string"
                ? JSON.parse(content.quiz)
                : content.quiz,
            resources:
              content.resources && typeof content.resources === "string"
                ? JSON.parse(content.resources)
                : content.resources,
            duration: content.duration,
            position: content.position,
          })),
        };

        setSection(transformedSection);

        // Si hay contentId, cargar ese contenido para edición
        if (contentId && contentId !== 'new') {
          try {
            const content = await getContentById(contentId);
            const contentToEdit: IContent = {
              id: content.id || contentId,
              contentId: content.id || contentId,
              title: content.title || '',
              text: content.text || '',
              markdown: content.markdown,
              quiz:
                content.quiz && typeof content.quiz === "string"
                  ? JSON.parse(content.quiz)
                  : content.quiz || [],
              resources:
                content.resources && typeof content.resources === "string"
                  ? JSON.parse(content.resources)
                  : content.resources || [],
              duration: content.duration || 0,
              position: content.position || transformedSection.contents.length,
            };
            editContent(contentToEdit);
          } catch (err) {
            console.error("Error cargando contenido:", err);
            // Si no se puede cargar el contenido, buscar en la sección
            const existingContent = transformedSection.contents.find((c: IContent) => c.id === contentId);
            if (existingContent) {
              editContent(existingContent);
            }
          }
        } else if (contentId === 'new') {
          // Iniciar modo de agregar contenido
          addContent();
        }
      } catch (err) {
        console.error("Error cargando sección/contenido:", err);
      }
    };

    loadSectionAndContent();
  }, [sectionSlug, slug, contentId, setSection, editContent, addContent]);

  if (!sectionState.section) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/courses/${slug}/section/${sectionSlug}`)}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Volver a la sección
        </button>
      </div>
      <SectionList courseId={course?.id?.toString() || ''} sectionId={sectionId || sectionSlug} />
    </div>
  );
}

function ContentEditPage() {
  return (
    <SectionProvider>
      <ContentManager />
    </SectionProvider>
  );
}

export default ContentEditPage;
