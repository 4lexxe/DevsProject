import type React from "react"
import { useState } from "react"
import { FileText, Video, ImageIcon, File, LinkIcon, ExternalLink, ChevronDown, ChevronUp, ClipboardList } from "lucide-react"
import { Link } from 'react-router-dom'
import { Content } from '@/course/interfaces/viewnerCourseInterface';

interface ContentViewerProps {
  content: Content
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${minutes}m`
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const renderSectionHeader = (icon: React.ReactNode, title: string, duration?: number) => (
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
      {expandedSection === title ? (
        <ChevronUp className="w-5 h-5 text-gray-500" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-500" />
      )}
    </div>
  )

  return (
    <div className="space-y-4 w-full max-w-3xl mx-auto">
      {/* Text Content */}
      {content.title && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
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
          {expandedSection === "text" && (
            <Link to={`/course/section/content/${content.id}`}>
              <div className="prose max-w-none text-gray-700 leading-relaxed p-4 bg-gray-50">
                {content.text}
              </div>
            </Link>
          )}
        </div>
      )}

     
    </div>
  )
}

export default ContentViewer