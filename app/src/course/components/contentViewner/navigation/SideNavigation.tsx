import { useState } from "react";
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
    <div
      className={`transition-all duration-300 ease-in-out rounded-lg ${
        isExpanded ? "w-full max-w-sm" : "w-16"
      }`}
      style={{ backgroundColor: "#f2f6f9" }}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <button
            className="p-2 hover:bg-gray-200 rounded"
            onClick={toggleSidebar}
          >
            <ChevronRight
              className={`transform transition-transform ${
                isExpanded ? "" : "rotate-180"
              }`}
              size={20}
            />
          </button>
          {isExpanded && (
            <h1 className="text-lg font-medium">{navigate.title}</h1>
          )}
        </div>

        {isExpanded && (
          <div className="space-y-2">
            {navigate.sections.map((section) => (
              <div key={section.id} className="rounded-lg bg-gray-200">
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
                        expandedSections.includes(section.id)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </button>

                {expandedSections.includes(section.id) && section.contents && (
                  <div className="px-4 pb-4">
                    {section.contents.map((content) => (
                      <Link
                        to={`/course/${navigate.id}/section/content/${content.id}`}
                        className="w-full"
                        key={content.id}
                      >
                        <div className={`flex items-center gap-2 p-2 rounded ${
                          currentId === content.id ? "bg-gray-300" : "hover:bg-gray-300"
                        }`}>
                          {currentId === content.id && (
                            <CircleDot className="w-5 h-5 text-cyan-600 ml-2" />
                          )}
                          <span className={`font-medium ${
                            currentId === content.id ? "font-bold" : ""
                          }`}>{content.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
