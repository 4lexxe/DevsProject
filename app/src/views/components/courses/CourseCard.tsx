import { Clock, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  id: number; // ID del curso
  title: string;
  summary: string;
  courseName: string; // Nombre de la categoría
  image: string; // URL de la imagen
  relatedCareerType: string; // Tipo de carrera relacionada
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  summary,
  courseName,
  image,
  relatedCareerType
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`); // Redirige a la ruta del curso
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Borde continuo */}
      <div
        className="absolute inset-0 border-2 border-solid border-gray-300 rounded-3xl"
        style={{ top: '-8px', left: '-8px', right: '-8px', bottom: '-8px' }}
      />

      {/* Contenido de la tarjeta */}
      <div className="relative bg-white rounded-2xl shadow-sm overflow-hidden m-2">
        <img
          src={image || '/placeholder.svg'}
          alt={title}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
          <p className="text-gray-600 mb-4 line-clamp-2">{summary}</p>

          <div className="flex items-center mb-4 text-sm text-gray-500">
            {courseName}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-500">
              <BarChart className="w-4 h-4 mr-1" />
              {relatedCareerType}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              Duración {/* Pendiente agregar si aplica */}
            </div>
          </div>

          <button
            onClick={handleViewCourse}
            className="w-full px-4 py-2 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] transition-colors duration-200"
          >
            Ver Curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
