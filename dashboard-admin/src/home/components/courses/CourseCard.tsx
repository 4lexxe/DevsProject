import type React from "react";
import { Clock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  summary: string;
  courseName: string;
  image: string;
  careerType: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  summary,
  courseName,
  image,
  careerType,
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-lg">
      {/* Borde minimalista */}
      <div
        className="absolute inset-0 border border-gray-400 rounded-2xl"
        style={{ top: "-4px", left: "-4px", right: "-4px", bottom: "-4px" }}
      />

      {/* Contenido de la tarjeta */}
      <div className="relative bg-white rounded-xl overflow-hidden h-full flex flex-col">
        {/* Banner con imagen y tipo de carrera */}
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-48 object-cover"
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {/* Tipo de carrera - visible en todos los tamaños */}
          <div className="absolute bottom-3 left-3 bg-white/90 px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 backdrop-blur-sm flex items-center gap-2 shadow-sm">
            <GraduationCap className="w-3.5 h-3.5 text-[#00D7FF]" />
            {careerType}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          {/* Título */}
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
            {title}
          </h3>

          {/* Tipo de carrera debajo del título */}
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-700">
            <GraduationCap className="w-4 h-4 text-[#00D7FF]" />
            <span>{careerType}</span>
          </div>

          {/* Descripción */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">{summary}</p>

          {/* Información del curso */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {/* Nombre del curso */}
            <div className="inline-flex items-center gap-1.5 text-sm text-gray-700">
              <BookOpen className="w-4 h-4 text-[#00D7FF]" />
              <span className="line-clamp-1">{courseName}</span>
            </div>
            {/* Indicador de nuevo curso */}
            <div className="inline-flex items-center gap-1.5 text-sm text-gray-500">
              <Clock className="w-4 h-4 text-[#00D7FF]" />
              <span>Nuevo</span>
            </div>
          </div>

          {/* Botón */}
          <button
            onClick={handleViewCourse}
            className="mt-auto w-full px-4 py-2.5 bg-gradient-to-r from-[#004e5c] via-[#0077ff] to-[#0084ff] text-white rounded-lg 
           transition-all duration-300 flex items-center justify-center gap-2 text-sm font-medium
           hover:shadow-md hover:from-[#01c4ff] hover:via-[#006deb] hover:to-[#00D7FF]"
          >
            Ver curso
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
