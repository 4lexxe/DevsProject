import type React from "react"
import type { Category, CareerType } from "@/course/interfaces/ViewnerCourse"
import { GraduationCap, Bookmark } from "lucide-react"

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
      {/* Thumbnail con borde y formato 16:9 en PC y cuadrado en móvil */}
      <div className="relative w-24 sm:w-36 md:w-44 flex-shrink-0"> 
        <div className="w-full p-1 bg-white shadow-sm">
          <div className="relative w-full h-full overflow-hidden aspect-[4/3] sm:aspect-video">
            <img
              src={image || "/placeholder.svg"}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover object-center transform transition-transform duration-300 group-hover:scale-105"
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
              {careerType?.name || "Sin categoría"}
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
      </div>
    </div>
  )
}

export default CourseListItem
