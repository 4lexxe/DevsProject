import type React from "react";
import { useState } from "react";
import {
  FileText,
  Video,
  ImageIcon,
  File,
  LinkIcon,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import { IContentApi } from "@/course/interfaces/Content";
import { getContentUrl } from "@/shared/utils/courseUrl";

interface ContentViewerProps {
  content: IContentApi;
  courseId: string;
  courseSlug?: string;
  sectionSlug?: string;
  isPublicView?: boolean; // Indica si estamos en vista pública (sin acceso al contenido real)
  isAuthenticatedNoAccess?: boolean; // Usuario logueado pero sin acceso (no ha comprado)
}

const ContentViewer: React.FC<ContentViewerProps> = ({ 
  content, 
  courseId, 
  courseSlug,
  sectionSlug,
  isPublicView = false,
  isAuthenticatedNoAccess = false
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleContentClick = (e: React.MouseEvent) => {
    if (isPublicView || isAuthenticatedNoAccess) {
      e.preventDefault();
      // Redirigir a la página del curso para que pueda comprarlo o iniciar sesión
      const courseUrl = courseSlug ? `/course/${courseSlug}` : `/course/${courseId}`;
      window.location.href = courseUrl;
    }
  };

  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    duration?: number
  ) => {
    // Si es vista pública o usuario logueado sin acceso, bloquear clicks
    if (isPublicView || isAuthenticatedNoAccess) {
      return (
        <div 
          className="flex items-center justify-between w-full cursor-not-allowed opacity-75"
          onClick={handleContentClick}
          title={isAuthenticatedNoAccess ? "Debes comprar el curso para acceder a este contenido" : "Debes iniciar sesión para acceder a este contenido"}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{title}</span>
            {duration && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full ml-2">
                {duration} min
              </span>
            )}
          </div>
        </div>
      );
    }
    
    // En vista con acceso, permitir navegación usando slugs
    const contentUrl = getContentUrl(
      courseSlug || courseId,
      sectionSlug,
      (content as any)?.slug || content.id
    );
    
    return (
      <Link to={contentUrl}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{title}</span>
            {duration && (
              <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full ml-2">
                {duration} min
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {/* Text Content */}
      {content.title && (
        <div className=" rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("text")}
          >
            {renderSectionHeader(
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />,
              content.title || "Content Description",
              content.duration
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
