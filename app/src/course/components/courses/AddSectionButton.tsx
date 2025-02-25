// components/courses/AddSectionButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react'; // Importamos el ícono de Lucide

interface AddSectionButtonProps {
  courseId: string; // ID del curso al que pertenece la sección
}

const AddSectionButton: React.FC<AddSectionButtonProps> = ({ courseId }) => {
  return (
    <Link to={`/course/${courseId}/section/form`}>
      <button
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
        {/* Ícono */}
        <PlusCircle
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
          Agregar sección
        </span>
      </button>
    </Link>
  );
};

export default AddSectionButton;