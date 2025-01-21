import type React from "react"
import { useState } from "react"
import { FileText, Video, ImageIcon, File, LinkIcon, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"

interface Content {
  id: number
  type: string
  contentText?: string
  contentVideo?: string
  contentVideoTitle?: string
  contentImage?: string
  contentImageTitle?: string
  contentFile?: string
  contentFileTitle?: string
  externalLink?: string
  externalLinkTitle?: string
  duration?: number
  position?: number
  sectionId: number
}

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
            {formatDuration(duration)}
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
      {content.contentText && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("text")}
          >
            {renderSectionHeader(<FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />, "Content Description")}
          </button>
          {expandedSection === "text" && (
            <div className="prose max-w-none text-gray-700 leading-relaxed p-4 bg-gray-50">{content.contentText}</div>
          )}
        </div>
      )}

      {/* Video Content */}
      {content.contentVideo && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("video")}
          >
            {renderSectionHeader(
              <Video className="w-5 h-5 text-blue-600 flex-shrink-0" />,
              content.contentVideoTitle || "Video Content",
              content.duration,
            )}
          </button>
          {expandedSection === "video" && (
            <div className="aspect-video w-full bg-gray-900">
              <iframe
                src={content.contentVideo}
                className="w-full h-full"
                allowFullScreen
                title={content.contentVideoTitle || "Video content"}
              />
            </div>
          )}
        </div>
      )}

      {/* Image Content */}
      {content.contentImage && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("image")}
          >
            {renderSectionHeader(
              <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />,
              content.contentImageTitle || "Visual Content",
            )}
          </button>
          {expandedSection === "image" && (
            <div className="relative">
              <img
                src={content.contentImage || "/placeholder.svg"}
                alt={content.contentImageTitle || "Content image"}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}

      {/* File Content */}
      {content.contentFile && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("file")}
          >
            {renderSectionHeader(
              <File className="w-5 h-5 text-blue-600 flex-shrink-0" />,
              content.contentFileTitle || "Additional Resource",
            )}
          </button>
          {expandedSection === "file" && (
            <div className="p-4 bg-gray-50">
              <a
                href={content.contentFile}
                download
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Download Resource</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* External Link */}
      {content.externalLink && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-3 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection("link")}
          >
            {renderSectionHeader(
              <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0" />,
              content.externalLinkTitle || "External Resource",
            )}
          </button>
          {expandedSection === "link" && (
            <div className="p-4 bg-gray-50">
              <a
                href={content.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Visit Resource</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContentViewer

