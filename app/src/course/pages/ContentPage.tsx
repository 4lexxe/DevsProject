import type React from "react";
import { useParams } from "react-router-dom";
import { getNavegationById } from "../services/courseServices";
import { useEffect, useState } from "react";
import SideNavigationLoading from "../components/contentViewner/loading/SideNavigationLoading";
import ContentLoading from "../components/contentViewner/loading/ContentLoading";

const ContentPage: React.FC = () => {
  
  const { contentId } = useParams<{ contentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (!contentId || !courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-cyan-50 via-white to-slate-100 p-4 sm:p-6 lg:p-8 pt-20">
      <div className="flex flex-col lg:flex-row justify-around">
        <ContentLoading
          contentId={contentId}
          courseId={courseId}
          sidebarExpanded={sidebarExpanded}
        />

        <SideNavigationLoading
          contentId={contentId}
          courseId={courseId}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={setSidebarExpanded}
        />
      </div>
    </div>
  );
};

export default ContentPage;
