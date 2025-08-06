import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import ContentDetail from "./ContentDetail";
import { getContentById } from "@/course/services/contentServices";
import { accessContent, markContentCompleted } from "@/course/services/progressService";
import { toast } from 'react-hot-toast';

function ContentLoading({
  contentId,
  courseId,
}: {
  contentId: string;
  courseId: string;
}) {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchContent = async () => {
      if (!contentId) return;
      try {
        const data = await getContentById(contentId);

        if (isMounted) {
          setTimeout(() => {
            if (isMounted) {
              setContent(data);
              // Registrar acceso al contenido
              registerContentAccess();
            }
          }, 500);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error al obtener el contenido:", err);
        }
      }
    };

    const registerContentAccess = async () => {
      try {
        // Registrar acceso al contenido
        await accessContent(courseId, contentId);
        console.log('Acceso al contenido registrado');
        
        // Marcar automáticamente como completado
        await markContentCompleted(courseId, contentId);
        console.log('Contenido marcado como completado automáticamente');
        toast.success('¡Contenido completado!');
      } catch (error) {
        console.error('Error al procesar contenido:', error);
      }
    };

    setContent(null);
    fetchContent();

    return () => {
      isMounted = false;
    };
  }, [contentId, courseId]);

  if (!content) {
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
          courseId={courseId}
          prev={content.previousContentId}
          next={content.nextContentId}
          title={content.content.title}
        />
      </div>

      <ContentDetail 
        courseId={courseId} 
        content={content.content} 
      />
    </div>
  );
}

export default ContentLoading;
