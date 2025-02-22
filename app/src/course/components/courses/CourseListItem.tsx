import type React from "react"
import type { Category, CareerType } from "@/course/interfaces/ViewnerCourse"
import { GraduationCap, Clock, ChevronRight, Bookmark } from "lucide-react"

interface CourseListItemProps {
  id: number
  title: string
  summary: string
  categories: Category[]
  image: string
  careerType: CareerType
}

const CourseListItem: React.FC<CourseListItemProps> = ({ id, title, summary, categories, image, careerType }) => {
  return (
    <div
      className="group w-full flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50/80 transition-all duration-300 cursor-pointer"
      onClick={() => (window.location.href = `/course/${id}`)}
    >
{/* Thumbnail con borde y marco */}
<div className="relative w-24 sm:w-32 md:w-64 flex-shrink-0"> 
  <div className="aspect-[3/2] sm:aspect-video w-full h-full border-2 border-gray-200 rounded-lg p-1 bg-white shadow-sm">
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={image || "/placeholder.svg"}
        alt={title}
        className="absolute inset-0 w-full h-full object-contain rounded-md transform transition-transform duration-300 group-hover:scale-105"
      />
      <button
        className="absolute top-1 right-1 p-1 sm:p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors z-10"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
      </button>
    </div>
  </div>
</div>

      {/* Course Information */}
      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
      <div>
      <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2 group-hover:text-gray-700">
      {title}
      </h3>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2 sm:line-clamp-3">{summary}</p>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5 mb-2">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded-full">
        <GraduationCap className="w-3.5 h-3.5" />
        {careerType.name}
      </span>
      {/* Categories are hidden on mobile */}
      <div className="hidden sm:flex flex-wrap gap-1.5">
        {categories.map((category, index) => (
        <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
        >
        {category.name}
        </span>
        ))}
      </div>
      </div>
      </div>

      {/* Action Area */}
      <div className="flex items-center justify-between mt-auto">
      <span className="inline-flex items-center text-sm text-gray-500">
      <Clock className="w-4 h-4" />
      <span className="hidden sm:inline ml-1">Nuevo curso</span>
      </span>

      <button className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#186370] to-[#1f8a9b] text-white text-sm font-medium rounded-lg hover:from-[#1f8a9b] hover:to-[#66E7FF] transition-all duration-300 group-hover:shadow-md">
      <span className="hidden sm:inline">Ver Curso</span>
      <span className="sm:hidden">Ver</span>
      <ChevronRight className="w-4 h-4 ml-1" strokeWidth={2.5} />
      </button>
      </div>
      </div>
    </div>
  )
}

export default CourseListItem