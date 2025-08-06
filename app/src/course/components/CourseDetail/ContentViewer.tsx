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

interface ContentViewerProps {
  content: IContentApi;
  courseId: string;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content, courseId }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderSectionHeader = (
    icon: React.ReactNode,
    title: string,
    duration?: number
  ) => (
    <Link to={`/course/${courseId}/section/content/${content.id}`}>
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

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {/* Text Content */}
      {content.title && (
        <div className="rounded-lg overflow-hidden border border-gray-200">
          <div className="w-full px-4 py-3 bg-white">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium">{content.title}</span>
                {content.duration && (
                  <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full ml-2">
                    {content.duration} min
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentViewer;
