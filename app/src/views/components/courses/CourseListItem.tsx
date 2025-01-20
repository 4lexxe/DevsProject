'use client'

interface CourseListItemProps {
  id: number;
  title: string;
  summary: string;
  courseName: string;
  image: string;
  relatedCareerType: string;
}

const CourseListItem: React.FC<CourseListItemProps> = ({
  id,
  title,
  summary,
  courseName,
  image,
  relatedCareerType
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Imagen del curso */}
      <div className="flex-shrink-0">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="w-full sm:w-48 h-32 object-cover rounded-lg"
        />
      </div>

      {/* Información del curso */}
      <div className="flex-grow min-w-0">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{summary}</p>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {courseName}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
            {relatedCareerType}
          </span>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="flex-shrink-0 flex items-start sm:ml-4 mt-3 sm:mt-0">
        <button 
          onClick={() => window.location.href = `/course/${id}`}
          className="w-full sm:w-auto px-4 py-2 bg-[#00D7FF] text-black text-sm font-medium rounded hover:bg-[#66E7FF] transition-colors duration-200"
        >
          Ver Curso
        </button>
      </div>
    </div>
  )
}

export default CourseListItem