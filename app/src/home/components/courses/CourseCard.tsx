import { Clock, BookOpen, GraduationCap, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  id: number;
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
  careerType
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`);
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Borde continuo */}
      <div
        className="absolute inset-0 border-2 border-solid border-gray-300 rounded-3xl"
        style={{ top: '-8px', left: '-8px', right: '-8px', bottom: '-8px' }}
      />

      {/* Contenido de la tarjeta */}
      <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden m-2 h-full flex flex-col">
        {/* Banner con imagen y tipo de carrera */}
        <div className="relative">
          <img
            src={image || '/placeholder.svg'}
            alt={title}
            className="w-full h-48 rounded-t-2xl object-contain"
          />
          {/* Tipo de carrera en esquina - visible solo en móvil */}
          <div className="md:hidden absolute top-3 right-3 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700 backdrop-blur-sm flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            {careerType}
          </div>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          {/* Contenedor fijo para título */}
          <div className="h-14 mb-2">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Contenedor fijo para descripción */}
          <div className="h-12 mb-4">
            <p className="text-sm md:text-base text-gray-600 line-clamp-2">
              {summary}
            </p>
          </div>

          {/* Nombre del curso */}
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
              <BookOpen className="w-4 h-4 text-gray-600" />
              <span className="line-clamp-1">{courseName}</span>
            </div>
          </div>

          {/* Tipo de carrera - visible solo en desktop */}
          <div className="hidden md:flex items-center text-sm text-gray-500 gap-2 mb-4">
            <GraduationCap className="w-4 h-4" />
            <span className="line-clamp-1">{careerType}</span>
          </div>

          {/* Botón */}
          <button
            onClick={handleViewCourse}
            className="w-full px-4 py-2.5 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] 
                     transition-colors duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
          >
            Ver Curso
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;