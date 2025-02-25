import React from "react";
import { BookOpen } from "lucide-react";

interface PrerequisitesProps {
  prerequisites: string[];
}

const Prerequisites: React.FC<PrerequisitesProps> = ({ prerequisites }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#1a1f36]">Pre-requisitos del curso</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {prerequisites && prerequisites.length > 0 ? (
          prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-indigo-600 mt-1 flex-shrink-0" />
              <p className="text-[#1a1f36] text-sm">{prerequisite}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-full">No hay pre-requisitos.</p>
        )}
      </div>
    </section>
  );
};

export default Prerequisites;