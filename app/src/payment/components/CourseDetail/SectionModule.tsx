import React, { useState } from "react";
import {
  BookCopy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ContentViewer from "./ContentViewer";
import { Section } from "@/course/interfaces/ViewnerCourse";

interface SectionModuleProps {
  section: Section;
}

const SectionModule: React.FC<SectionModuleProps> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-300">
      <div
        className="cursor-pointer relative"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="relative">
          {/* Background image with gradient overlay */}
          <div className="relative h-24 w-full">
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  section.coverImage ||
                  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
                })`,
              }}
            />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, 
                ${section.colorGradient[0]}cc, 
                ${section.colorGradient[1]}cc)`,
              }}
            />
            {/* Module icon */}
            <div className="absolute -bottom-6 left-6">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <BookCopy />
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 pt-8">
          {/* Module type badge */}
          <div className="flex justify-between items-center">
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-gray-100 text-gray-700 mb-3">
              {section.moduleType}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {section.title}
          </h3>
          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-2">
            {section.description}
          </p>
        </div>
      </div>
      {/* Content Section */}
      {isExpanded && (
        <div className="border-t border-gray-100 py-6">
          <div className="space-y-4">
            {section.contents &&
              section.contents.map((content) => (
                <ContentViewer courseId={section.courseId} key={content.id} content={content} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionModule;