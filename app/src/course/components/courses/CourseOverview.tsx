import React from 'react';
import { Clock, BookOpen, Code } from 'lucide-react';

interface CourseOverviewProps {
  about: string;
  careerType: string;
  numberOfModules: number;
  createdAt: string;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({
  about,
  careerType,
  numberOfModules,
  createdAt,
}) => {
  // Formateamos la fecha de creación a 'día mes año'
  const formattedDate = new Date(createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4">Descripción del Curso</h2>
      <p className="text-gray-600 mb-6">{about}</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-blue-600" />
          <span>{careerType}</span>
        </div>
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          <span>{numberOfModules} módulos</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>{formattedDate}</span>
        </div>
      </div>
    </section>
  );
};

export default CourseOverview;
