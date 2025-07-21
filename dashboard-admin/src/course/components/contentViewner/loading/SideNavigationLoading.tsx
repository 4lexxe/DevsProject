import { useState, useEffect } from "react";
import SideNavigation from "../navigation/SideNavigation";
import { getNavegationById } from "../../../services/courseServices";

interface Props {
  contentId: string;
  courseId: string;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
}

function SideNavigationLoading({
  contentId,
  courseId,
  sidebarExpanded,
  setSidebarExpanded,
}: Props) {
  const [navigate, setNavigate] = useState<any>(null);

  useEffect(() => {
    const fetchNavegation = async () => {
      if (!courseId) return; // Evita hacer la petición si no hay un ID válido
      try {
        const data = await getNavegationById(courseId);
        console.log(data);
        setTimeout(() => {
          setNavigate(data);
        }, 500);
      } catch (err) {
        console.error("Error al obtener la navegacion:", err);
      }
    };

    fetchNavegation();
  }, [courseId]);

  if (!navigate) {
    return (
      <div
        className={`transition-all duration-500 ease-in-out rounded-lg md:w-1/3 lg:w-1/4 h-full hidden md:block `}
        style={{ backgroundColor: "#f2f6f9" }}
      >
        <div className="p-4">
          {/* Header with logo and title placeholders */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
          </div>

          {/* Navigation sections */}
          <div className="space-y-4">
            {/* First section */}
            <div className="rounded-lg bg-gray-100 p-2">
              <div className="h-6 w-24 bg-gray-300 rounded mb-3 animate-pulse"></div>
              {/* Navigation items */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 mb-2">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>

            {/* Second section */}
            <div className="rounded-lg bg-gray-100 p-2">
              <div className="h-6 w-32 bg-gray-300 rounded mb-3 animate-pulse"></div>
              {/* Navigation items */}
              {[1, 2].map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 mb-2">
                  <div className="h-4 w-full bg-gray-300 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`transition-all duration-500 ease-in-out rounded-lg mt-0 h-full hidden md:block ${
        sidebarExpanded ? "md:w-1/3 lg:w-1/4" : "md:w-16"
      }`}
      style={{ backgroundColor: "#f2f6f9" }}
    >
      <SideNavigation
        currentId={contentId}
        navigate={navigate}
        isExpanded={sidebarExpanded}
        setIsExpanded={setSidebarExpanded}
      />
    </div>
  );
}

export default SideNavigationLoading;
