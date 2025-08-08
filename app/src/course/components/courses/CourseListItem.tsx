import type React from "react"
import type { Category, CareerType } from "@/course/interfaces/ViewnerCourse"
import { GraduationCap } from "lucide-react"

interface CourseListItemProps {
  id: number
  title: string
  summary: string
  categories: Category[]
  image: string
  careerType: CareerType
  pricing?: {
    originalPrice: number
    finalPrice: number
    hasDiscount: boolean
    savings: number
  }
}

const CourseListItem: React.FC<CourseListItemProps> = ({ id, title, summary, categories, image, careerType, pricing }) => {
  return (
    <div
      className="group w-full flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50/80 transition-all duration-300 cursor-pointer"
      onClick={() => {
        if (id && id !== undefined) {
          window.location.href = `/course/${id}`;
        } else {
          console.error('ID del curso no válido:', id);
        }
      }}
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
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-300 text-xs rounded-full">
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
          
          {/* Pricing section - visible on mobile */}
          {pricing && (
            <div className="mt-2 flex items-center gap-2">
              {pricing.finalPrice === 0 ? (
                <span className="text-lg font-bold text-green-600">
                  Gratis
                </span>
              ) : pricing.hasDiscount ? (
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">
                    ${pricing.finalPrice.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ${pricing.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                    -{Math.round(((pricing.originalPrice - pricing.finalPrice) / pricing.originalPrice) * 100)}%
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ${pricing.finalPrice.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseListItem
