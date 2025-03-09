import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CircleDot, ChevronRight, ChevronDown } from "lucide-react";

type Content = {
  id: string;
  title: string;
};

type Section = {
  id: number;
  title: string;
  contents: Content[];
};

type CourseNavigate = {
  id: string;
  title: string;
  sections: Section[];
};

interface Props {
  currentId: string;
  navigate: CourseNavigate;
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
}

export default function Sidebar({
  currentId,
  navigate,
  isExpanded: externalIsExpanded,
  setIsExpanded: setExternalIsExpanded,
}: Props) {
  const [internalIsExpanded, setInternalIsExpanded] = useState(true);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  // Use external state if provided, otherwise use internal state
  const isExpanded =
    externalIsExpanded !== undefined ? externalIsExpanded : internalIsExpanded;
  const setIsExpanded = setExternalIsExpanded || setInternalIsExpanded;

  // Auto expand section that contains current content
  useEffect(() => {
    navigate.sections.forEach((section) => {
      if (section.contents.some((content) => content.id === currentId)) {
        setExpandedSections((prev) =>
          prev.includes(section.id) ? prev : [...prev, section.id]
        );
      }
    });
  }, [currentId, navigate.sections]);

  const toggleSection = (sectionId: number) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 h-full">
      <div className="flex items-center gap-2">
        <button
          className="p-2 hover:bg-gray-200 rounded transition-colors duration-300"
          onClick={toggleSidebar}
        >
          <ChevronRight
            className={`transform transition-transform duration-500 ${
              isExpanded ? "" : "rotate-180"
            }`}
            size={20}
          />
        </button>
        <div
          className={`overflow-hidden transition-all duration-500 ${
            isExpanded ? "opacity-100" : "opacity-0 max-w-0"
          }`}
        >
          <h1 className="text-lg font-medium ">{navigate.title}</h1>
        </div>
      </div>

      <div
        className={`space-y-2 transition-all duration-500 overflow-hidden  ${
          isExpanded ? "opacity-100 " : "opacity-0 max-h-0"
        }`}
      >
        {navigate.sections.map((section) => (
          <div key={section.id} className="rounded-lg bg-gray-200 mt-4">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="text-left">
                  <div className="font-medium">{section.title}</div>
                  <div className="text-sm text-gray-600">
                    {section.contents.length} contenidos
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChevronDown
                  size={20}
                  className={`transition-transform ${
                    expandedSections.includes(section.id) ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            <div 
              className={`px-4 transition-all duration-400 overflow-hidden ${
                expandedSections.includes(section.id) 
                  ? "max-h-96 opacity-100 pb-4" 
                  : "max-h-0 opacity-0 pb-0"
              }`}
            >
              {section.contents.map((content) => (
                <Link
                  to={`/course/${navigate.id}/section/content/${content.id}`}
                  className="w-full"
                  key={content.id}
                >
                  <div
                    className={`flex items-center gap-2 p-2 rounded ${
                      currentId === content.id
                        ? "bg-gray-300"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    {currentId === content.id && (
                      <CircleDot className="w-5 h-5 text-cyan-600 ml-2" />
                    )}
                    <span
                      className={`font-medium ${
                        currentId === content.id ? "font-bold" : ""
                      }`}
                    >
                      {content.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
