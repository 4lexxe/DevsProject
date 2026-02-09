import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import ContentDetail from "./ContentDetail";
import { getContentById } from "@/course/services/contentServices";
import { accessContent, markContentCompleted } from "@/course/services/progressService";
import { toast } from 'react-hot-toast';

function ContentLoading({
  contentId,
  courseId,
  sectionSlug,
  contentSlug,
}: {
  contentId: string;
  courseId: string;
  sectionSlug?: string;
  contentSlug?: string;
}) {
  const navigate = useNavigate();
  const [content, setContent] = useState<any>(null);
  const [accessError, setAccessError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      if (!contentId) return;
      try {
        setLoading(true);
        setAccessError(null);
        
        // Usar slugs si están disponibles, sino usar ID (compatibilidad)
        let data;
        // Verificar si tenemos slugs válidos (no son solo números)
        const hasValidSlugs = courseId && sectionSlug && contentSlug && 
            !courseId.match(/^\d+$/) && 
            !sectionSlug.match(/^\d+$/) && 
            !contentSlug.match(/^\d+$/);
        
        if (hasValidSlugs) {
          // Usar slugs
          const { getContentBySlugs } = await import("@/course/services/contentServices");
          data = await getContentBySlugs(courseId, sectionSlug, contentSlug);
        } else {
          // Usar ID (ruta antigua)
          data = await getContentById(contentId);
        }
        if (isMounted) {
          setContent(data);
          setAccessError(null);
          
          // Usar courseId de los datos si está disponible, sino usar el parámetro
          const actualCourseId = data.courseId || courseId;
          
          // Registrar acceso solo después de cargar el contenido exitosamente
          try {
            await accessContent(parseInt(actualCourseId), parseInt(contentId));
            console.log('Acceso al contenido registrado');
            
            // Marcar automáticamente como completado
            await markContentCompleted(parseInt(actualCourseId), parseInt(contentId));
            console.log('Contenido marcado como completado automáticamente');
            toast.success('¡Contenido completado!');
          } catch (progressError) {
            console.error('Error al procesar progreso del contenido:', progressError);
            // No bloqueamos la visualización si hay error en el progreso
          }
        }
      } catch (err: any) {
        if (isMounted) {
          console.error("Error al obtener el contenido:", err);
          // Verificar si es un error de acceso (403) o no autenticado (401)
          if (err.response?.status === 403 || err.response?.status === 401) {
            const errorData = err.response.data;
            // Si requiere autenticación, redirigir al login con returnUrl
            if (errorData?.requiresAuth || err.response?.status === 401) {
              const currentUrl = window.location.pathname;
              navigate(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
              return;
            }
            // Si requiere acceso (compra), redirigir a la página del curso
            if (errorData?.requiresAccess) {
              const courseSlug = courseId && !courseId.match(/^\d+$/) ? courseId : undefined;
              const courseUrl = courseSlug ? `/course/${courseSlug}` : `/course/${courseId}`;
              navigate(courseUrl);
              return;
            }
            // Fallback: redirigir al login
            navigate(`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`);
            return;
          } else {
            setAccessError({
              message: "Error al cargar el contenido",
              requiresAuth: false,
              requiresAccess: false
            });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    setContent(null);
    setAccessError(null);
    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [contentId, courseId, sectionSlug, contentSlug, navigate]);

  // Si hay error de acceso, ya se redirigió, mostrar loading mientras redirige
  if (accessError && (accessError.requiresAuth || accessError.requiresAccess)) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  if (loading || !content) {
    return (
      <div className="flex-1 transition-all duration-500 ease-in-out">
        {/* Loading TopBar */}
        <div className="mb-8">
          <div
            className="flex items-center justify-between h-12 px-2 rounded-lg"
            style={{ backgroundColor: "#f2f6f9" }}
          >
            <div className="p-2 w-8 h-8" />
            <div className="h-6 w-48 bg-gray-300 rounded animate-pulse" />
            <div className="p-2 w-8 h-8" />
          </div>
        </div>

        {/* Loading Content Detail */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 to-blue-900 p-6 text-white">
            <div className="h-10 w-3/4 bg-white bg-opacity-30 rounded animate-pulse mb-4"></div>
            <div className="flex items-center text-sm">
              <div className="w-4 h-4 mr-2 bg-white bg-opacity-30 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-white bg-opacity-30 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Text placeholder */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
            </div>

            {/* Resource placeholder */}
            <div className="mb-8 mt-8 bg-gradient-to-r from-cyan-50 to-slate-100 p-6 rounded-xl">
              <div className="h-6 w-48 bg-gray-300 rounded animate-pulse mb-3"></div>
              <div className="h-12 w-40 bg-gradient-to-r from-cyan-600 to-blue-900 rounded-lg animate-pulse"></div>
            </div>

            {/* Markdown content placeholder */}
            <div className="mt-8">
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8">
                <div className="h-8 w-48 bg-gray-300 rounded animate-pulse mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 w-5/6 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 flex justify-between items-center">
            <div className="h-4 w-48 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-gradient-to-r from-cyan-600 to-blue-900 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className={`flex-1 transition-all duration-500 ease-in-out`}>
      <div className="mb-8">
        <TopBar
          courseSlug={content.courseSlug}
          courseId={content.courseId || courseId}
          prev={content.previousContentId}
          next={content.nextContentId}
          title={content.content.title}
        />
      </div>

      <ContentDetail 
        courseId={content.courseId || courseId}
        courseSlug={content.courseSlug}
        content={content.content} 
      />
    </div>
  );
}

export default ContentLoading;
