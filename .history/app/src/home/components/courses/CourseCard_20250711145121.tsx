import type React from "react";
import { motion } from "framer-motion";
import { Clock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  careerType,
}) => {
  const navigate = useNavigate();

  const handleViewCourse = () => {
    navigate(`/course/${id}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="relative w-full max-w-sm mx-auto transition-all duration-300 hover:shadow-2xl group"
    >
      {/* Borde mejorado */}
      <div className="absolute inset-0 border border-gray-300 rounded-2xl group-hover:border-blue-200 transition-colors duration-300 shadow-sm group-hover:shadow-lg" 
           style={{ top: "-4px", left: "-4px", right: "-4px", bottom: "-4px" }} />

      {/* Contenido de la tarjeta */}
      <div className="relative bg-white rounded-xl overflow-hidden h-full flex flex-col">
        {/* Banner con imagen y tipo de carrera */}
        <div className="relative">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          {/* Overlay gradiente mejorado */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Tipo de carrera mejorado */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-gray-700 shadow-md flex items-center gap-2 border border-white/50">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            {careerType}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          {/* Título mejorado */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
            {title}
          </h3>

          {/* Tipo de carrera debajo del título mejorado */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span className="font-medium">{careerType}</span>
          </div>

          {/* Descripción mejorada */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">{summary}</p>

          {/* Información del curso mejorada */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Nombre del curso */}
            <div className="inline-flex items-center gap-1.5 text-sm text-gray-700 bg-blue-50 px-3 py-1 rounded-full">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span className="line-clamp-1 font-medium">{courseName}</span>
            </div>
            {/* Indicador de nuevo curso */}
            <div className="inline-flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-green-600" />
              <span className="font-medium">Nuevo</span>
            </div>
          </div>

          {/* Botón mejorado */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleViewCourse}
            className="mt-auto w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl 
                     transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold
                     hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1"
          >
            Ver curso
            <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>

      {/* Elementos decorativos sutiles */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"></div>
    </motion.div>
  );
};

export default CourseCard;
