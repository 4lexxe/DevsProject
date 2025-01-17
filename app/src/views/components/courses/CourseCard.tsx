import { Clock, BarChart } from 'lucide-react';

// Definimos las propiedades que recibirá el componente 'CourseCard'
interface CourseCardProps {
  title: string;
  summary: string;
  courseName: string; // Nombre del curso (antes 'instructor')
  image: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title, summary, courseName, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-black">{title}</h3>
        <p className="text-black/70 mb-4 line-clamp-2">{summary}</p>
        <div className="flex items-center mb-4 text-sm text-black/60">
          {/* Aquí usamos el nombre del curso en lugar de "User" */}
          {courseName}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-black/60">
            <BarChart className="w-4 h-4 mr-1" />
            Nivel {/* Este campo aún no lo tienes en la API, así que lo puedes omitir por ahora */}
          </div>
          <div className="flex items-center text-sm text-black/60">
            <Clock className="w-4 h-4 mr-1" />
            Duración {/* Este campo tampoco lo tienes en la API, pero puedes ponerlo más tarde */}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-[#00D7FF]">Precio {/* Este campo tampoco lo tienes, pero lo puedes agregar más tarde */}</span>
          <button className="px-4 py-2 bg-[#00D7FF] text-black rounded-md hover:bg-[#66E7FF] transition-colors duration-200">
            Ver Curso
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;