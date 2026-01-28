import type React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SideNavigationLoading from "../components/Content/SideNavigationLoading";
import ContentLoading from "../components/Content/ContentLoading";
import AccessDenied from "@/shared/components/AccessDenied";
import { getContentById } from "@/course/services/contentServices";
import { getNavegationById } from "@/course/services/courseServices";
import { accessContent, markContentCompleted } from "@/course/services/progressService";
import { toast } from 'react-hot-toast';

const ContentPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [navigation, setNavigation] = useState<any>(null);
  const [contentError, setContentError] = useState<{ status?: number; message?: string } | null>(null);
  const [navigationError, setNavigationError] = useState<{ status?: number; message?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Maneja la transición suave
  const handleSidebarToggle = (expanded: boolean) => {
    setIsTransitioning(true);
    setSidebarExpanded(expanded);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match duration to the CSS transition
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!contentId || !courseId) return;
      
      setIsLoading(true);
      setContent(null);
      setContentError(null);
      setNavigationError(null);

      // Fetch content y navigation por separado para manejar errores independientemente
      const contentPromise = getContentById(contentId).catch((err: any) => {
        console.error("Error al obtener contenido:", err);
        if (isMounted) {
          setContentError({
            status: err.response?.status,
            message: err.response?.data?.message || "Error al cargar el contenido"
          });
        }
        return null;
      });

      const navigationPromise = getNavegationById(courseId).catch((err: any) => {
        console.error("Error al obtener navegación:", err);
        if (isMounted) {
          setNavigationError({
            status: err.response?.status,
            message: err.response?.data?.message || "Error al cargar la navegación"
          });
        }
        return null;
      });

      const [contentData, navigationData] = await Promise.all([
        contentPromise,
        navigationPromise
      ]);

      if (isMounted) {
        if (contentData) {
          setContent(contentData);
        }
        if (navigationData) {
          setNavigation(navigationData);
        }
      }

      // Registrar acceso y marcar como completado solo si el contenido se cargó correctamente
      if (contentData) {
        try {
          await accessContent(parseInt(courseId), parseInt(contentId));
          await markContentCompleted(parseInt(courseId), parseInt(contentId));
          toast.success('¡Contenido completado!');
        } catch (progressError) {
          console.error('Error al procesar progreso:', progressError);
        }
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [contentId, courseId]);

  if (!contentId || !courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Si hay error en el contenido, mostrar AccessDenied
  if (contentError) {
    return (
      <div className="h-full from-cyan-50 via-white to-slate-100 mx-5 lg:mx-8 xl:mx-12 my-12">
        <AccessDenied message={contentError.message} />
      </div>
    );
  }

  return (
    <div className="h-full from-cyan-50 via-white to-slate-100 mx-5 lg:mx-8 xl:mx-12 my-12">
      <div
        className={`flex flex-row gap-4 lg:gap-8 xl:gap-12 justify-between transition-all duration-500`}
      >
        <ContentLoading 
          contentId={contentId} 
          courseId={courseId}
          content={content}
          error={contentError}
          isLoading={isLoading}
        />

        {!navigationError && (
          <SideNavigationLoading
            contentId={contentId}
            courseId={courseId}
            navigation={navigation}
            isLoading={isLoading}
            sidebarExpanded={sidebarExpanded}
            setSidebarExpanded={handleSidebarToggle}
          />
        )}
      </div>
    </div>
  );
};

export default ContentPage;
