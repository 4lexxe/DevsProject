import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

interface EditCourseButtonProps {
  courseId: string;
}

const EditCourseButton: React.FC<EditCourseButtonProps> = ({ courseId }) => {
  console.log("Course ID en EditCourseButton:", courseId); // Depuración
  return (
    <Link 
      to={`/courses/${courseId}/edit`}
      className="absolute top-4 right-4 z-10"
    >
      {/* Contenedor principal */}
      <div 
        className="
          flex 
          items-center 
          gap-2 
          px-4 
          py-2 
          rounded-lg 
          bg-gray-100/70 
          hover:bg-gray-200 
          shadow-md 
          hover:shadow-lg 
          transition-all 
          duration-300 
          transform 
          hover:scale-105 
          focus:outline-none 
          focus:ring-2 
          focus:ring-gray-300 
          focus:ring-offset-2
        "
      >
        {/* Ícono sin contenedor propio */}
        <Edit 
          className="
            w-5 
            h-5 
            text-gray-600 
            group-hover:text-gray-800 
            transition-colors 
            duration-300
          " 
        />

        {/* Texto visible solo en pantallas grandes */}
        <span className="hidden md:inline text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
          Editar curso
        </span>
      </div>
    </Link>
  );
};

export default EditCourseButton;