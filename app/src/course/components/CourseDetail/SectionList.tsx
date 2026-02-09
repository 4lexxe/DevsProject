// components/courses/SectionList.tsx
import React, { useEffect, useState } from "react";
import { getSectionsByCourse, getPublicCourseStructure } from "../../services/sectionServices";
import SectionModule from "./SectionModule";
import { Section } from "@/course/interfaces/ViewnerCourse";
import { useAuth } from "@/user/contexts/AuthContext";

interface SectionListProps {
  courseId: string;
  courseSlug?: string; // Slug del curso para generar URLs
}

const SectionList: React.FC<SectionListProps> = ({ courseId, courseSlug }) => {
  const { user } = useAuth(); // Obtener usuario para detectar si está logueado
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPublicView, setIsPublicView] = useState(false); // Indica si estamos mostrando vista pública
  const [isAuthenticatedNoAccess, setIsAuthenticatedNoAccess] = useState(false); // Usuario logueado pero sin acceso

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        // Intentar obtener secciones completas (requiere autenticación y acceso)
        try {
          const response = await getSectionsByCourse(courseId);
          setSections(response);
          setIsPublicView(false);
        } catch (authError: any) {
          // Si falla con 403 (sin acceso) o 401 (no autenticado), usar vista pública
          if (authError.response?.status === 403 || authError.response?.status === 401) {
            console.log("Sin acceso al curso, mostrando estructura pública");
            const publicStructure = await getPublicCourseStructure(courseId);
            // La respuesta pública devuelve directamente las secciones
            setSections(publicStructure || []);
            setIsPublicView(true);
            
            // Si el usuario está logueado pero recibió 403, significa que no ha comprado el curso
            if (authError.response?.status === 403 && user) {
              setIsAuthenticatedNoAccess(true);
            }
          } else {
            throw authError;
          }
        }
      } catch (err) {
        console.error("Error fetching sections:", err);
        setError("No se pudieron cargar las secciones del curso");
      } finally {
        setLoading(false);
      }
    };
    fetchSections();
  }, [courseId, user]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6 bg-white rounded-b-lg border border-gray-100">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          No hay secciones disponibles para este curso.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Lista de secciones */}
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div key={section.id}>
            <SectionModule 
              section={section} 
              isPublicView={isPublicView}
              isAuthenticatedNoAccess={isAuthenticatedNoAccess}
              courseSlug={courseSlug}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionList;