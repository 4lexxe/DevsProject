import type React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SideNavigationLoading from "../components/contentViewner/loading/SideNavigationLoading";
import ContentLoading from "../components/contentViewner/loading/ContentLoading";

const ContentPage: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();
  const { courseId } = useParams<{ courseId: string }>();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Maneja la transición suave
  const handleSidebarToggle = (expanded: boolean) => {
    setIsTransitioning(true);
    setSidebarExpanded(expanded);

    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Match duration to the CSS transition
  };

  if (!contentId || !courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="animate-pulse text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="h-full from-cyan-50 via-white to-slate-100 mx-5 lg:mx-8 xl:mx-12 my-12">
      <div
        className={`flex flex-row gap-4 lg:gap-8 xl:gap-12 justify-between transition-all duration-500`}
      >
        <ContentLoading contentId={contentId} courseId={courseId} />

        <SideNavigationLoading
          contentId={contentId}
          courseId={courseId}
          sidebarExpanded={sidebarExpanded}
          setSidebarExpanded={handleSidebarToggle}
        />
      </div>
    </div>
  );
};

export default ContentPage;
