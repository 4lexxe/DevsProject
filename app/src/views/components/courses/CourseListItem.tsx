'use client'

interface CourseListItemProps {
  id: number; // ID del curso
  title: string;
  summary: string;
  courseName: string; // Nombre de la categoría
  image: string; // URL de la imagen
  relatedCareerType: string; // Tipo de carrera relacionada
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
    <div className="flex gap-4 p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
      {/* Imagen del curso */}
      <div className="flex-shrink-0">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="w-64 h-36 object-cover rounded-lg"
        />
      </div>

      {/* Información del curso */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{summary}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {courseName}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {relatedCareerType}
          </span>
        </div>
      </div>

      {/* Botón de acción */}
      <div className="flex-shrink-0 flex items-start">
        <button 
          onClick={() => window.location.href = `/course/${id}`}
          className="px-4 py-2 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] transition-colors duration-200"
        >
          Ver Curso
        </button>
      </div>
    </div>
  )
}

export default CourseListItem
