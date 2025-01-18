import { Clock, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Definimos las propiedades que recibirá el componente 'CourseCard'
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
  relatedCareerType,
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`); // Redirige a la ruta del curso
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
        <p className="text-black/70 mb-4 line-clamp-2">{summary}</p>
        <div className="flex items-center mb-4 text-sm text-black/60">
          {courseName} {/* Muestra la categoría */}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-black/60">
            <BarChart className="w-4 h-4 mr-1" />
            {relatedCareerType} {/* Muestra el tipo de carrera */}
          </div>
          <div className="flex items-center text-sm text-black/60">
            <Clock className="w-4 h-4 mr-1" />
            Duración {/* Pendiente agregar si aplica */}
          </div>
        </div>
        <button
          onClick={handleViewCourse}
          className="px-4 py-2 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] transition-colors duration-200"
        >
          Ver Curso
        </button>
      </div>
    </div>
  );
};

export default CourseCard;