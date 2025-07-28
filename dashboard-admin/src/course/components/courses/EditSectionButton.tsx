import React from 'react';
import { Link } from 'react-router-dom';
import { Edit } from 'lucide-react';

interface EditSectionButtonProps {
  courseId: string;
  sectionId: string;
}

const EditSectionButton: React.FC<EditSectionButtonProps> = ({ courseId, sectionId }) => {
  return (
    <Link 
      to={`/courses/${courseId}/section/${sectionId}/edit`}
      className="absolute top-4 right-4 z-10"
    >
      <button 
        className="
          flex 
          items-center 
          gap-2 
          p-3 
          rounded-full 
          bg-gray-100 
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
          md:flex-row 
          sm:flex-col 
        "
      >
        {/* Icono */}
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
          Editar esta sección
        </span>
      </button>
    </Link>
  );
};

export default EditSectionButton;