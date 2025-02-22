import React from 'react';
import { BookOpen } from 'lucide-react';

interface PrerequisitesProps {
  prerequisites: string[];
}

const Prerequisites: React.FC<PrerequisitesProps> = ({ prerequisites }) => {
  return (
    <section className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">Prerrequisitos del curso</h2>
      <ul className="space-y-3">
        {prerequisites.map((prerequisite, index) => (
          <li key={index} className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <span className="text-gray-600 text-sm">{prerequisite}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Prerequisites;